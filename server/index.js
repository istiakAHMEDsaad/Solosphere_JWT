const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 9000;
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionalSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@my-mongodb.2rdes.mongodb.net/?retryWrites=true&w=majority&appName=My-MongoDB`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db('solo-db');
    const jobsCollection = db.collection('jobs');
    const bidsCollection = db.collection('bids');

    //generate json web token
    app.post('/jwt', async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.SECRET_KEY, {
        expiresIn: '30d',
      });
      // console.log(token)
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    //clear token from cookies (we can use both get & post)
    app.get('/logoutWithCookies', async (req, res) => {
      res
        .clearCookie('token', {
          maxAge: 0,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    //verify token
    const verifyToken = (req, res, next) => {
      const token = req.cookies?.token;
      if (!token) {
        return res.status(401).send({ message: 'unauthorized access' });
      }
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' });
        }
        //create user property (email, exp date)
        req.user = decoded;
      });
      next();
    };

    // save a jobData in db
    app.post('/add-job', async (req, res) => {
      const jobData = req.body;
      const result = await jobsCollection.insertOne(jobData);
      res.send(result);
    });

    // get all jobs data from db
    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });

    // get all jobs posted by a specific user
    app.get('/jobs/:email', verifyToken, async (req, res) => {
      const decodedEmail = req.user?.email;
      const email = req.params.email;
      if (decodedEmail !== email) {
        return res.status(401).send({ message: 'unauthorized access' });
      }

      const query = { 'buyer.email': email };
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    });

    // delete a job from db
    app.delete('/job/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    });

    // get a single job data by id from db
    app.get('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    // save a jobData in db
    app.put('/update-job/:id', async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const updated = {
        $set: jobData,
      };
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await jobsCollection.updateOne(query, updated, options);
      res.send(result);
    });

    // -------------------------------------------------------------------- \\
    // =========================== Important ========================== //
    // -------------------------------------------------------------------- //
    app.post('/add-bid', async (req, res) => {
      const bidData = req.body;
      // check same post duplicate bid
      const query = {
        email: bidData.email,
        jobId: bidData.jobId,
      };
      const alreadyExist = await bidsCollection.findOne(query);
      if (alreadyExist) {
        return res
          .status(400)
          .send('You have already placed a bid on this job!');
      }

      // Save data in bids collection
      const result = await bidsCollection.insertOne(bidData);
      // Increase bids count in db
      const filter = { _id: new ObjectId(bidData.jobId) };
      const update = {
        $inc: { bid_count: 1 },
      };
      const updateBidCount = await jobsCollection.updateOne(filter, update);

      res.send(result);
    });

    //get all bids by a specific user
    app.get('/bids/:email', verifyToken, async (req, res) => {
      const isBuyer = req.query.buyer;
      const email = req.params.email;

      const decodedEmail = req.user?.email;
      if (decodedEmail !== email) {
        return res.status(401).send({
          message: 'unauthorized access',
        });
      }

      //email: email
      let query = {};
      if (isBuyer) {
        query.buyer = email;
      } else {
        query.email = email;
      }
      const result = await bidsCollection.find(query).toArray();
      res.send(result);
    });

    //update bid status
    app.patch('/bid-status-update/:id', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;

      const filter = { _id: new ObjectId(id) };
      const updated = {
        $set: { status },
      };
      const result = await bidsCollection.updateOne(filter, updated);
      res.send(result);
    });

    // get all jobs
    app.get('/all-jobs', async (req, res) => {
      //=> search method
      const search = req.query.search;
      //=> filter method
      const filter = req.query.filter;
      //=> sort method
      const sort = req.query.sort;
      let option = {};

      if (sort) {
        option = {
          sort: {
            deadline: sort === 'asc' ? 1 : -1,
          },
        };
      }

      let query = {
        title: {
          $regex: search,
          $options: 'i', //case-insensitive
        },
      };
      if (filter) {
        query.category = filter;
      }
      const result = await jobsCollection.find(query, option).toArray();
      res.send(result);
    });

    /* app.get(`/bid-request/:email`, async (req, res) => {
      const email = req.params.email;
      const query = { buyer: email };
      const result = await bidsCollection.find(query).toArray();
      res.send(result);

    }); */

    // -------------------------------------------------------------------- //

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send({ server: 'server is running...' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

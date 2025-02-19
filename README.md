# Project Requirements

A company is looking for a full-stack web developer capable of creating a simple full-stack website similar to online marketplaces.

Make sure your website design is unique. Visit ThemeForest, Dribble, Google, etc., to get some ideas. You can explore Tailwind component libraries.

* generate key (node):
```sh
require('crypto').randomBytes(64).toString('hex')
```
* cookies option
```js
cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
```

## Main Requirements

1.  **Visual Appeal:** Focus on making the website visually appealing. Ensure that:
    *   Color contrast is pleasing to the eye.
    *   The website has proper alignment and spacing.
    *   If needed, customize the design of any component you are taking from any component library. (For example, if you are using DaisyUI and have taken a card component, customize the styling of the card to make it reasonable rather than just copy & paste it.)

2.  **Navbar and Footer:** Keep the navbar and footer on all pages except the 404 page. Create a reasonable and meaningful footer (including website logo + name, copyright, contact information, social media links, address, etc.).

3.  **Navbar Content:** The navbar should include the name + logo, Home, Add Job, My Posted Jobs, My Bids, Bid Requests, User profile picture and user name, and Register/Login options.

4.  **Login & Registration:**
    *   **Error Messages:** Display relevant error messages on the Registration and Login pages when necessary.
    *   **Login Page:** When a user clicks on the login button, they will be redirected to the login page with:
        *   Email/Password login
        *   Google Sign-in
        *   A link to the registration page
    *   **Registration Page:** The Registration page will have a form with the following fields:
        *   Name
        *   Email
        *   Password
        *   PhotoURL
    *   **Note:** Do not enforce email verification or password reset methods.

5.  **Home Page:**
    *   **Banner:** The banner section will have a banner/carousel with relevant images.
    *   **Browse By Category:**
        *   A tab-based system for browsing jobs, categorized as Web Development, Digital Marketing, and Graphics Design. Each tab will display at least four job cards.
        *   Job data will be retrieved from a MongoDB database. Users will add job data from the Add Job page (see No. 7).
        *   Implement tabs using the [React-tabs](https://www.npmjs.com/package/react-tabs) NPM package.
        *   **Job Card Information:** Each card should display:
            *   Job title
            *   Deadline
            *   Price range
            *   Short description
            *   "Bid Now" button (or make the whole card clickable)
    *   **(Optional) Extra Sections:** Add two extra sections relevant to the website (highly recommended).

6.  **Job Details Page:**
    *   Clicking the "Bid Now" button or card redirects the user to the job details route (`/job/:id`) containing job information (Name, Deadline, Price Range, Description, etc.) and a "Place A Bid" form section.
    *   **"Place A Bid" Form:**
        *   Price (user's bidding amount)
        *   Deadline
        *   Email (read-only, from user context)
        *   Buyer Email (read-only, from user context, the job poster's email)
        *   "Bid on the project" button (disabled for the job poster)
    *   **Bid Submission:** Clicking "Bid on the project" stores the data in a MongoDB database, displays a toast message (no JavaScript alerts), and redirects the user to the "My Bids" page (see No. 9).
    *   **Note:** Employers cannot bid on their own jobs.

7.  **Add Jobs Page:**
    *   A form with the following fields:
        *   Employer Email (read-only)
        *   Job title
        *   Deadline
        *   Description
        *   Category (dropdown with options matching homepage tabs)
        *   Minimum price
        *   Maximum price
        *   "Add Job" button
    *   **Job Submission:** Clicking "Add Job" stores the data in a MongoDB database, displays a toast message, and redirects the user to the "My Posted Jobs" page (see No. 8).

8.  **My Posted Jobs Page:**
    *   Displays all jobs posted by the logged-in user in a table format.
    *   Each row has "Update" and "Delete" buttons.
    *   **Update Action:**
        *   Opens a form (modal or separate route) to update job information (email is not editable).
        *   Clicking the "Update" button updates the data, displays a toast message, and redirects back to the "My Posted Jobs" page.
    *   **Delete Action:**
        *   Asks for delete confirmation before removing the job.
    *   **Note:** Users can only see and manage their own job postings.

9.  **My Bids Page:**
    *   Displays all bids placed by the logged-in user in a table format.
    *   Each row includes:
        *   Job title
        *   Email
        *   Deadline
        *   Status (initially "Pending")
        *   "Complete" button (conditional)
    *   **Status Updates:**
        *   Job owner rejects bid: Status changes to "Rejected."
        *   Job owner accepts bid: Status changes to "In Progress," "Complete" button is enabled.
        *   User clicks "Complete": Status changes to "Complete," "Complete" button is disabled.

10. **Bid Requests Page:**
    *   Displays all bid requests for the logged-in user's posted jobs in a table format.
    *   Each row includes:
        *   Job title
        *   Bidder Email
        *   Deadline
        *   Price
        *   Category
        *   Status
        *   "Accept" button
        *   "Reject" button
    *   **Status Management:**
        *   Initially, both "Accept" and "Reject" buttons are enabled.
        *   Clicking "Reject" changes the status to "Rejected" and disables the "Reject" button.
        *   Clicking "Accept" changes the status to "In Progress" and disables the "Accept" button.

11. **404 Page:**
    *   A 404 page with an interesting image (JPG/GIF) and a "Back to Home" button.
    *   No header or footer on this page.

12. **Environment Variables:** Use environment variables to hide Firebase config keys and MongoDB credentials.

13. **Private Routes:** Protect the following routes with private route authentication:
    *   My Bids page
    *   Add Job page
    *   My Posted Jobs page
    *   Bid Request page
    *   Job Detail page

**Optional (Highly Recommended) - Strict Deadlines:**

1.  When adding a job, validate the deadline input as a valid date.
2.  If a job's deadline has passed (compare using `Date.now()`), disable the "Bid on this project" button.
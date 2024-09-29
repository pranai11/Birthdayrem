# Birthdayrem

**Birthdayrem** is a web application designed to help users remember and manage birthdays of their friends, family, and loved ones. By storing important dates and email addresses, the app automatically sends email reminders to ensure that no birthday is forgotten.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Pages and Flow](#pages-and-flow)
7. [Future Enhancements](#future-enhancements)
8. [Contributing](#contributing)

## Project Overview
The **Birthdayrem** app allows users to:
- Add birthdays of friends and family members.
- Receive email reminders on birthdays.
- Customize the frequency of reminders.

The application ensures that users stay connected by sending timely notifications for important events.

## Features
- **User Registration & Login**: Secure authentication for each user to store personal birthday data.
- **Birthday Management**: Add, edit, and delete birthday entries easily.
- **Email Reminders**: Automated email reminders sent on the morning of the birthday.
- **Custom Reminder Options**: Option to set custom reminder times or receive notifications before the actual day.
- **Responsive Design**: Accessible from both mobile and desktop devices.

## Technologies Used
- **Frontend**: React.js, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB for storing user and birthday data.
- **Email Service**: NodeMailer for email reminders.
- **Authentication**: JWT for secure user login.
- **Deployment**: Deployed on Heroku (or mention your specific deployment platform).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pranai11/Birthdayrem.git
   cd Birthdayrem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables for MongoDB connection and email service (e.g., `NODEMAILER_EMAIL`, `NODEMAILER_PASSWORD`).

4. Start the development server:
   ```bash
   npm start
   ```

## Usage
1. Register a new account or log in with existing credentials.
2. Add new birthdays to the list using the “Add Birthday” form.
3. View all saved birthdays on the dashboard.
4. Receive email reminders based on the set preferences.

## Pages and Flow

### 1. **Homepage**  
   The homepage features an introduction to the application with a user-friendly interface. It contains options to log in or sign up.

### 2. **Sign Up / Login**  
   Secure sign-up and login features with JWT-based authentication, ensuring user data is safe.

### 3. **Dashboard**  
   After logging in, users are directed to the dashboard where they can:
   - View a list of upcoming birthdays.
   - Add new birthdays.
   - Edit or delete existing birthdays.
   - Customize email reminder settings.

### 4. **Settings**  
   Users can customize their preferences for reminder notifications and update their email address if needed.

## Future Enhancements
- **SMS Notifications**: Add an option for SMS reminders.
- **Birthday Cards**: Include features to send virtual birthday cards along with reminders.
- **Social Media Integration**: Automatically share birthday wishes on social media platforms.
- **Multi-language Support**: Make the app available in multiple languages.

## Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request for any bugs or features.

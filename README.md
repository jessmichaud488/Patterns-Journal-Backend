<h1>P A T T E R N S  J O U R N A L</h1>
<P>Front end code can be found at: https://github.com/jessmichaud488/Patterns-Journal-Frontend</p>

![HomePage](https://github.com/jessmichaud488/Patterns-Journal-Frontend/blob/master/src/images/HomePage.png)

![LogIn Page](
https://github.com/jessmichaud488/Patterns-Journal-Frontend/blob/master/src/images/NewEntry.png)

![New Entry](https://github.com/jessmichaud488/Patterns-Journal-Frontend/blob/master/src/images/LogIn.png
)

![EditEntry](https://github.com/jessmichaud488/Patterns-Journal-Frontend/blob/master/src/images/EditEntry.png)

<H2>APPLICATION WEBSITE</h2>
<p>A working prototype of this app can be viewed at <a href="https://stark-lowlands-96685.herokuapp.com/">https://stark-lowlands-96685.herokuapp.com/</a></p>

<h2>USE CASE</h2>
<p>Inspired by a friend who was working through a difficult time with their mental health, I wanted to create an app that would allow you to be able to keep track of your emotions and sleep so that these patterns and any changes can be communicated more clearly to a mental health professional.</p>

<h2>HOW IT WORKS</h2>
<p>Easily record thoughts, mood, emotional intensity and sleep on the go.Simply sign up and start jotting or browse through older entries to investigate mood and sleep pattern changes.</p>

<h2>FUNCTIONALITY</h2>
<p>This app's functionality includes:</p>
<ul>
	<li>Securely sign up for an account</li>
<li>Securely log into an account</li>
<li>Create a new journal entry</li>
<li>Update a journal entry</li>
<li>Record sleep, emotional intensity, and mood within entry</li>
<li>Save all entries and have the ability to browse through past entries</li>
</ul>

<h2>SECURITY</h2>
<p>User passwords are encrypted using bcrypt.js</p>

<h2>TECHNOLOGY</h2>
<h3>Front End</h3>
<ul>
	<li>HTML</li>
	<li>CSS</li>
	<li>JavaScript</li>
	<li>React</li>
</ul>

<h3>Back End</h3>
<ul>
	<li>Node.js</li>
	<li>Express</li>
	<li>MongoDB</li>
	<li>Mongoose</li>
	<li>bcryptjs</li>
	<li>Passport</li>
</ul>

<h2>API Documentation</h2>
<p>API endpoints for the back end include:</p>

<ul>USER</ul>
<li>GET to '/:id' to retrieve user profile<</li>
<li>POST to ‘/signUp’ to create a new user account</li>
<li>PUT to ‘/:id’ to update a specific user account</li>

<ul>ENTRY</ul>
<li>GET to ‘/:id’ to view a specific entry</li>
<li>POST to ‘/’ to create a new entry</li>
<li>PUT to ‘/:id’ to edit a specific entry</li>

<h2>DEVELOPMENT</h2>
<p>Future updates for V2 are expected to include:</p>
<ul>
	<li>An average or summary of mood, sleep, and emotions entries to better track patterns of behavior</li> 
	<li>DELETE  to '/:id' in USER and ENTRY to delete specific users and entries</li>
</ul>



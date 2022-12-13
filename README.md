## Reminisce

### Background and Overview
Reminisce is essentially a "GitHub for Writers" built using the MERN stack -- MongoDb, Express.js, React, and Node.js. We created our own version control system and text editor and combined them into a single application that enables users to write, commit their progress, and toggle between multiple drafts (e.g. for alternate endings). 

We enabled writers to execute complex version control actions by recreating the committing and branching workflows natively and simplifying processes by removing the use of terminal and using custom React modals in its place. We used Myers' diff algorithm to identify the text differences between commits and branches. 


## Contents
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Code Highlights](#code-highlights)
* [Planned Work](#planned-work)


## Technologies Used

#### Backend
* Backend Framework: Node/Express (v8.11.1/v4.17.3)
* Database: MongoDB (v3.0.6)
* User Authentication: Google OAuth

#### Frontend
* Frontend Framework: React (v18.0.0)
* Notable React Library: @mui/material (5.6.2), ckeditor5 (34.0.0)
* Styling: HTML5/CSS3/SASS

## Features

### Splash Page
Users must log in in order to access the site. Users can log in via Google OAuth.

### Projects Dashboard
Once logged in, user will be presented with all projects that they've created or have been added as a collaborator on.

### Project Show Page
List of documents that pertain to the selected project. On this page, users can:
 * Toggle between different drafts (branches)
 * Click a specific document to edit
 * Go to the save history page for a history of saves for the project. 
 * Save the current project draft (commit)

#### Document Editor
Editing a specific document. Users will be spending the bulk of their time on this page. They can save this page directly, or toggle between past drafts as well. 

#### Save History
Log of past saves (commits). When clicking on a specific save, a modal will pop up with the differentials between the current save and the save immediately prior. There will be a mini map with green and red highlights where users can jump to the sections of the document that changed.

<!-- #### Resolve Conflicts from Merging Drafts
Once the user decides to combine two drafts, if there are any merge conflicts (same paragraph was changed in both drafts), the conflicting paragraph will be displayed for the user to decide which version to keep. In the resolve conflicts modal, paragarphs before and after the conflict will be included for context. -->



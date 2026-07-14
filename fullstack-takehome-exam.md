# Full-Stack Developer Take-Home Assessment

## Overview
Build a simple **Task Management API with a Web Interface** that demonstrates your ability to create a functional full-stack application from scratch.

**Time Expectation:** 4-6 hours of focused work  
**Submission Deadline:** 1 week from receipt  

## Project Requirements

### Core Functionality
Create a task management application with the following features:

1. **Task CRUD Operations**
   - Create new tasks
   - View all tasks (with pagination)
   - Update task details
   - Delete tasks
   - Mark tasks as complete/incomplete

2. **Task Properties**
   - Title (required, max 100 characters)
   - Description (optional, max 500 characters)
   - Status (pending/in-progress/completed)
   - Priority (low/medium/high)
   - Due date (optional)
   - Created timestamp
   - Updated timestamp

3. **Filtering and Sorting**
   - Filter tasks by status
   - Filter tasks by priority
   - Sort by due date, created date, or priority
   - Search tasks by title/description

### Technical Requirements

#### Backend
- RESTful API design
- Input validation and error handling
- Proper HTTP status codes
- API documentation (can be simple markdown or comments)
- At least 3 unit tests for critical functions

#### Frontend
- Clean, responsive UI (doesn't need to be beautiful, but should be functional)
- Form validation
- Loading states
- Error handling and user feedback
- Should work on mobile and desktop viewports

#### Database
- Use SQLite, JSON file, or any simple persistence layer
- Include a seed script or initial data
- Document the schema/structure

## Evaluation Criteria

### Code Quality (40%)
- Clean, readable code with consistent style
- Proper separation of concerns
- DRY principles
- Meaningful variable/function names
- Comments where necessary

### Functionality (30%)
- All features work as expected
- Proper error handling
- Edge cases considered
- Data validation

### Architecture (20%)
- Logical project structure
- RESTful API design
- Proper use of HTTP methods and status codes
- Efficient data flow

### Testing & Documentation (10%)
- Basic tests for critical paths
- Clear README with setup instructions
- API documentation
- Code comments where helpful

## Deliverables

1. **Source Code**
   - GitHub/GitLab repository (preferred) or ZIP file
   - Clear commit history showing progression

2. **README.md** including:
   - Project description
   - Tech stack choices and reasoning
   - Setup instructions
   - API endpoint documentation
   - Known limitations or trade-offs
   - Time spent on different parts

3. **Running Application**
   - Should be runnable locally with simple setup
   - Include any necessary seed data

## Bonus Points (Optional)
Only if you have extra time:
- Authentication (basic is fine)
- Real-time updates using WebSockets
- Docker containerization
- Deployment to a free hosting service
- Advanced filtering (date ranges, multiple filters)
- Bulk operations (delete/update multiple tasks)
- Export tasks to CSV/JSON
- Dark mode toggle

## Constraints & Guidelines

- **Tech Stack:** Use any language/framework you're comfortable with
- **External Libraries:** Allowed and encouraged where appropriate
- **UI Framework:** Bootstrap, Tailwind, Material UI, or plain CSS are all fine
- **No Over-Engineering:** We're looking for clean, simple solutions
- **Focus Areas:** Prioritize core functionality over aesthetics

## Example API Endpoints

```
GET    /api/tasks          # List all tasks (with pagination)
GET    /api/tasks/:id      # Get single task
POST   /api/tasks          # Create task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
GET    /api/tasks/search   # Search/filter tasks
```

## Submission Instructions

1. Complete the project within one week
2. Push code to a Git repository (make it public or provide access)
3. Deploy to a free service (optional but appreciated)
4. Email the repository link and any notes to: [hiring manager email]

## FAQs

**Q: Should I implement user authentication?**  
A: Not required for the base implementation. Focus on core CRUD functionality first.

**Q: How polished should the UI be?**  
A: Focus on functionality and usability over aesthetics. A clean, simple interface is perfect.

**Q: Can I use AI assistance?**  
A: Yes, but be prepared to explain every line of code in a follow-up interview.

**Q: What if I can't complete everything?**  
A: Document what you would have done given more time. We value quality over quantity.

**Q: Should I include a database migration system?**  
A: Not necessary for this scope, but document your schema clearly.

## Final Notes

- This assessment is designed to showcase your problem-solving skills and coding practices
- We understand everyone has different strengths - play to yours
- If you're stuck on something, document it and move on
- Quality over quantity - a well-built subset is better than a buggy complete system
- Show us how you think and work through problems

Good luck! We look forward to reviewing your submission.

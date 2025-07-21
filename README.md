# Day Planner Website

A modern, responsive day planner web application built with HTML, CSS, and JavaScript. This application helps you organize your daily tasks with a beautiful, intuitive interface.

## Features

### Core Functionality
- **Add Tasks**: Create tasks with title, description, time, and priority levels
- **Edit Tasks**: Modify existing tasks through a modal interface
- **Delete Tasks**: Remove individual tasks or bulk delete completed/all tasks
- **Task Completion**: Mark tasks as completed with visual feedback
- **Priority Levels**: Set tasks as High, Medium, or Low priority with color coding

### User Interface
- **Modern Design**: Clean, gradient-based design with glassmorphism effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Progress Tracking**: Circular progress indicator showing completion percentage
- **Task Filtering**: Filter tasks by All, Pending, or Completed status
- **Real-time Stats**: Display total and completed task counts

### Advanced Features
- **Local Storage**: Tasks persist between browser sessions
- **Time Formatting**: 12-hour time format with AM/PM display
- **Visual Feedback**: Notifications for user actions
- **Empty States**: Helpful messages when no tasks are present
- **Keyboard Shortcuts**: Form submission with Enter key

## File Structure

```
day-planner/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Technologies Used

- **HTML5**: Semantic markup and accessibility features
- **CSS3**: Modern styling with flexbox, grid, and animations
- **JavaScript ES6+**: Object-oriented programming with classes
- **Font Awesome**: Icons for enhanced UI
- **Local Storage API**: Data persistence

## Getting Started

1. **Download/Clone** the project files to your local machine
2. **Open** `index.html` in your web browser
3. **Start planning** your day by adding tasks!

## Usage

### Adding a Task
1. Fill in the task title (required)
2. Add an optional description
3. Set the time (required)
4. Choose priority level (Low, Medium, High)
5. Click "Add Task"

### Managing Tasks
- **Complete**: Click the circular checkbox to mark as done
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove a task
- **Filter**: Use filter buttons to view specific task types

### Quick Actions
- **Clear Completed**: Remove all completed tasks
- **Clear All Tasks**: Remove all tasks (with confirmation)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Features in Detail

### Responsive Design
The application adapts to different screen sizes:
- **Desktop**: Two-column layout with sidebar
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single-column layout with touch-friendly controls

### Data Persistence
Tasks are automatically saved to browser's local storage, ensuring your data persists between sessions.

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme

## Customization

### Changing Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #48bb78;
    --warning-color: #dd6b20;
    --danger-color: #e53e3e;
}
```

### Adding Features
The modular JavaScript structure makes it easy to add new features:
- Extend the `DayPlanner` class
- Add new methods for functionality
- Update the UI in `index.html`
- Style new elements in `styles.css`

## Performance

- **Lightweight**: No external dependencies except Font Awesome
- **Fast Loading**: Optimized CSS and JavaScript
- **Smooth Animations**: Hardware-accelerated transitions
- **Efficient Rendering**: Minimal DOM manipulation

## Future Enhancements

Potential features for future versions:
- Task categories/tags
- Due date reminders
- Task search functionality
- Export/import tasks
- Dark mode toggle
- Task templates
- Recurring tasks
- Calendar integration

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please refer to the code comments or create an issue in the project repository.

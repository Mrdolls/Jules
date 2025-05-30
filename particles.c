#define ATTRACT_STRENGTH 0.5f
#define CURSOR_RADIUS 35.0f

else if (ch == KEY_MOUSE) { // Handle mouse events
    if (getmouse(&event) == OK) {
        // Update cursor position on any mouse event (move, click, release)
        cursor_x = (float)event.x;
        cursor_y = (float)event.y;

        // Set attraction/repulsion modes based on button state during this event.
        // BUTTON1_PRESSED is typically set if button 1 is currently held down.
        // BUTTON3_PRESSED is typically set if button 3 is currently held down.
        // This allows for continuous interaction while a button is held and the mouse is moved.
        attract_mode_mouse = (event.bstate & BUTTON1_PRESSED);
        repel_mode_mouse = (event.bstate & BUTTON3_PRESSED);

        // If mouse interaction happens, stop any simulated spacebar click
        simulated_attract_active = false;
        space_is_currently_held = false; // Release spacebar hold state
        space_hold_start_time = 0;
    }
}

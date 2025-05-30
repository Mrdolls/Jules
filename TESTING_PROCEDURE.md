# Testing Procedure for particles.c

## A. Code Preparation Advisory

The current `particles.c` in the workspace is a snippet containing specific mouse handling logic and related macro definitions (`CURSOR_RADIUS`, `ATTRACT_STRENGTH`). It does **not** represent the full, compilable particle simulation program.

**To perform the tests outlined below, the full original source code for `particles.c` must be used.** This full version should include:
- All particle physics (gravity, bounce, friction, particle-particle repulsion).
- Rendering logic (color gradients, screen clearing).
- Main loop and ncurses initialization/teardown.
- Implementations for all keyboard controls (`q`, spacebar), inactivity features, terminal resizing, and command-line argument parsing.

**Ensure the following modifications, which were the subject of previous subtasks, are correctly applied to the full code:**
1.  `#define CURSOR_RADIUS 35.0f`
2.  `#define ATTRACT_STRENGTH 0.5f`
3.  The clarifying comments in the mouse handling section (regarding `cursor_x`/`cursor_y` updates and button-held interactions) are present.

## B. Compilation

Use the following command to compile `particles.c` (assuming ncurses and math libraries are needed):
```bash
gcc particles.c -o particles -lncurses -lm
```
Ensure that `ncurses` development libraries (e.g., `libncurses-dev` or `ncurses-devel`) are installed on the system.

## C. Testing Steps

Execute the compiled program using `./particles <num_particles>` or `./particles` for default particle count.

### I. Core Fluidity & Appearance:
1.  **Smoothness (Moderate Particles):**
    *   Run: `./particles 150`
    *   Observe: Overall animation smoothness and responsiveness.
2.  **Smoothness (Many Particles):**
    *   Run: `./particles 500` (or a higher number supported by the application)
    *   Observe: Note any significant slowdowns or choppiness, especially during mouse or keyboard interactions.
3.  **Particle Spawning:**
    *   Observe: Verify particles spawn at the top of the terminal, typically with initial random velocities/trajectories.
4.  **Color Gradient:**
    *   Observe: Check if particle colors change based on their Y position (or other intended logic, e.g., velocity) as described in the original program specification.

### II. Mouse Interaction (Key Focus):
1.  **Attraction (Left Click & Hold):**
    *   Action: Press and hold the left mouse button within the particle area.
    *   Observe: Do particles within a focused area around the cursor accelerate towards it?
    *   Action: Move the mouse while continuing to hold the left-click.
    *   Observe: Do particles dynamically follow the moving cursor?
    *   Assess: Evaluate if the `CURSOR_RADIUS 35.0f` and `ATTRACT_STRENGTH 0.5f` provide a good, controllable "follow" behavior. The interaction should feel targeted.
2.  **Repulsion (Right Click & Hold):**
    *   Action: Press and hold the right mouse button (or other button designated for repulsion, typically Button 3 in ncurses) within the particle area.
    *   Observe: Do particles within the defined radius flee from the cursor?
    *   Action: Move the mouse while continuing to hold the right-click.
    *   Observe: Do particles dynamically flee from the moving cursor?
3.  **No Button Interaction:**
    *   Action: Move the mouse around the particle area without pressing any buttons.
    *   Observe: Confirm that moving the mouse does *not* attract or repel particles. Particle behavior should remain unaffected by mouse position alone.
4.  **Interaction Radius:**
    *   Observe: Visually try to confirm if the interaction effect (attraction/repulsion) is limited to a small, focused area around the cursor, consistent with a `CURSOR_RADIUS` of `35.0f`.

### III. Regression Tests for Existing Features:
1.  **Physics:**
    *   **Gravity:** Observe that particles generally accelerate downwards.
    *   **Borders:** Observe that particles bounce off the screen edges (left, right, top) and the bottom boundary.
    *   **Friction/Stopping:** Observe that particles eventually slow down and come to rest, especially on the "ground" or after collisions, rather than moving indefinitely.
    *   **Particle-Particle Repulsion:** Observe that particles tend to push each other apart when they get too close, preventing excessive clumping.
2.  **Keyboard Controls:**
    *   **`q` or `Q`:** Press 'q' or 'Q'. Verify the application terminates cleanly.
    *   **`Spacebar (short press)`:** Press and release the spacebar quickly. Verify all (or a significant number of) particles exhibit a random "jump" or change in velocity.
    *   **`Spacebar (long press ~5s)`:** Press and hold the spacebar for approximately 5 seconds. Verify this activates an attraction mode from the screen center (or as per original functionality). Then, interact with the mouse (left/right click). Verify that mouse interaction correctly overrides or cancels the spacebar-induced attraction.
3.  **Inactivity Features:**
    *   **Automatic Jump:** Leave the simulation idle (no mouse or keyboard input) for approximately 10 seconds (or the specified duration). Observe if particles begin to jump automatically at random intervals (e.g., every 3-6 seconds).
    *   **Inactivity Message:** After the same inactivity period, check if help messages or other status indicators appear on screen.
    *   Action: Provide any input (move mouse, press a key).
    *   Observe: Verify help messages clear, and automatic jumps cease temporarily.
4.  **Terminal Resize:**
    *   Action: Manually resize the terminal window while the simulation is running.
    *   Observe: Check if the screen correctly clears, particles "shake" or reset, and the simulation adapts to the new dimensions. Particle colors and boundary conditions should re-initialize or adjust appropriately.
5.  **Command-line Argument:**
    *   Run: `./particles 50`. Verify the simulation runs with approximately 50 particles.
    *   Run: `./particles` (no argument). Verify it runs with a default number of particles.
    *   Run with invalid arguments: `./particles 0`, `./particles 9999` (if there's an upper limit), `./particles abc`. Ensure appropriate error messages are displayed and the program exits gracefully or defaults safely.

### IV. General Stability:
1.  **Extended Run:** Let the simulation run for several minutes while performing various interactions (mouse, keyboard, resizing, letting inactivity features trigger).
2.  **Observe:** Check for any crashes, freezes, memory leaks (if observable through system tools), or other unexpected visual artifacts or behaviors.

This testing procedure aims to be comprehensive. Adjust particle counts and timings based on the specific implementation details of the full `particles.c` program.

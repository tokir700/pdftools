:root {
    /* Color Palette */
    --clr-bg-dark: #0f172a; /* Slate 900 */
    --clr-card-bg: #1e293b; /* Slate 800 */
    --clr-text-light: #f1f5f9; /* Slate 100 */
    --clr-text-subtle: #94a3b8; /* Slate 400 */
    --clr-primary: #3b82f6; /* Blue 500 */
    --clr-primary-hover: #2563eb; /* Blue 600 */
    --clr-success: #22c55e; /* Green 500 */
    --clr-border: #334155; /* Slate 700 */
}

body {
    margin: 0;
    min-height: 100vh;
    background: var(--clr-bg-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', system-ui, sans-serif; /* Use a modern font stack */
    color: var(--clr-text-light);
    padding: 20px;
}

.card {
    background: var(--clr-card-bg);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    border-radius: 18px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--clr-border);
}

h1 {
    font-size: 28px;
    margin-top: 0;
    margin-bottom: 5px;
    font-weight: 700;
}

h1 .fas {
    color: var(--clr-primary);
    margin-right: 8px;
}

.sub {
    font-size: 15px;
    color: var(--clr-text-subtle);
    margin-bottom: 30px;
}

/* --- Input Styling --- */

.settings-group {
    text-align: left;
    margin-bottom: 20px;
}

.settings-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--clr-text-subtle);
}

.settings-group label .fas {
    margin-right: 5px;
}

select {
    width: 100%;
    padding: 12px 15px;
    margin: 0;
    background: var(--clr-bg-dark); /* Darker background for inputs */
    color: var(--clr-text-light);
    border: 1px solid var(--clr-border);
    border-radius: 10px;
    font-size: 16px;
    -webkit-appearance: none; /* Remove default arrow on select */
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 10px center;
    transition: border-color 0.2s;
}

select:focus {
    border-color: var(--clr-primary);
    outline: none;
}

/* --- File Upload Area --- */
.file-upload-area {
    margin-bottom: 25px;
}

#fileLabel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
    border: 2px dashed var(--clr-border);
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
}

#fileLabel:hover {
    background-color: rgba(59, 130, 246, 0.1); /* Blue-tint on hover */
    border-color: var(--clr-primary);
}

#fileLabel .fas {
    font-size: 30px;
    color: var(--clr-text-subtle);
    margin-bottom: 10px;
}

#fileLabel span {
    font-size: 14px;
    color: var(--clr-text-subtle);
}

/* File name display (when a file is selected) */
#fileLabel.file-selected {
    border-style: solid; /* change from dashed to solid */
}

#fileLabel.file-selected .fas {
    color: var(--clr-success); /* Icon turns green */
}

#fileLabel.file-selected span {
    color: var(--clr-text-light); /* Text becomes bright */
    font-weight: 600;
}

/* --- Button Styling --- */
button {
    width: 100%;
    padding: 14px;
    background: var(--clr-primary);
    border: none;
    border-radius: 10px;
    font-size: 17px;
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s, transform 0.1s;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

button .fas {
    margin-right: 8px;
}

button:hover:not(:disabled) {
    background: var(--clr-primary-hover);
    transform: translateY(-1px);
}

button:disabled {
    background: var(--clr-border);
    cursor: not-allowed;
    box-shadow: none;
}

/* --- Status and Progress --- */
.status-area {
    margin-top: 25px;
    min-height: 50px; /* Ensure space even when progress is small */
}

.progress {
    height: 8px;
    background: var(--clr-border);
    border-radius: 4px;
    margin-top: 10px;
    overflow: hidden;
}

#bar {
    height: 100%;
    width: 0%;
    background: var(--clr-success);
    transition: width 0.3s ease-in-out;
    border-radius: 4px;
}

#status {
    margin-top: 0;
    font-size: 15px;
    text-align: left;
    font-weight: 500;
    color: var(--clr-text-subtle);
}

#status .fas {
    margin-right: 6px;
    color: var(--clr-primary);
}

#status.success-message .fas {
    color: var(--clr-success);
}

/* --- Privacy Message --- */
.privacy {
    margin-top: 30px;
    font-size: 13px;
    color: var(--clr-text-subtle);
    border-top: 1px solid var(--clr-border);
    padding-top: 20px;
}

.privacy .fas {
    margin-right: 5px;
}

.privacy strong {
    color: var(--clr-text-light);
}

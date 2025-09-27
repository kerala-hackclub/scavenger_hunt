const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const problems = [];

// Read all problem JSON files
const problemsDir = path.join(__dirname, '..');
fs.readdirSync(problemsDir).forEach(file => {
  if (file.startsWith('problem_') && file.endsWith('.json')) {
    const filePath = path.join(problemsDir, file);
    const problemData = fs.readFileSync(filePath, 'utf8');
    problems.push(JSON.parse(problemData));
  }
});

app.get('/', (req, res) => {
  res.send('Scavenger Hunt Backend is running!');
});

// Maze logic
app.get('/maze/begin', (req, res) => {
  res.redirect('/maze/step1');
});

app.get('/maze/step1', (req, res) => {
  res.send('Add 2 to the current step number and go to that step. The next clue is at /maze/step3');
});

app.get('/maze/step3', (req, res) => {
  res.send('Multiply by 3 and go to that step. The next clue is at /maze/step5');
});

app.get('/maze/step5', (req, res) => {
    res.send('The next clue is at /maze/step15');
});

app.get('/maze/step15', (req, res) => {
  res.send('FLAG{redirect_expert}');
});

// Serve the zip file
app.get('/secret_vault.zip', (req, res) => {
  const filePath = path.join(__dirname, 'secret_vault.zip');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./frontend'));

// Data directory for storing game results
const resultsDir = path.join(__dirname, 'data');

// Ensure data directory exists
(async () => {
  try {
    await fs.mkdir(resultsDir, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
})();

// Save game result
app.post('/api/game/save', async (req, res) => {
  try {
    const { teamName, problemId, finalScores, choices, roles, duration } = req.body;
    
    const gameResult = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      teamName,
      problemId,
      finalScores,
      choices,
      roles,
      duration,
      exportedAt: null
    };

    // Save to individual file
    const filename = `game_${gameResult.id}.json`;
    const filepath = path.join(resultsDir, filename);
    await fs.writeFile(filepath, JSON.stringify(gameResult, null, 2));

    // Also append to results log
    const logPath = path.join(resultsDir, 'results-log.json');
    let results = [];
    try {
      const existing = await fs.readFile(logPath, 'utf8');
      results = JSON.parse(existing);
    } catch {
      results = [];
    }
    
    results.push(gameResult);
    await fs.writeFile(logPath, JSON.stringify(results, null, 2));

    res.json({
      success: true,
      message: 'Game result saved successfully',
      gameId: gameResult.id
    });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Retrieve game result
app.get('/api/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const filepath = path.join(resultsDir, `game_${gameId}.json`);
    
    const data = await fs.readFile(filepath, 'utf8');
    const gameResult = JSON.parse(data);
    
    res.json(gameResult);
  } catch (error) {
    console.error('Error retrieving game:', error);
    res.status(404).json({ success: false, error: 'Game not found' });
  }
});

// Get all results
app.get('/api/games', async (req, res) => {
  try {
    const logPath = path.join(resultsDir, 'results-log.json');
    const data = await fs.readFile(logPath, 'utf8');
    const results = JSON.parse(data);
    
    res.json({ games: results });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.json({ games: [] });
    }
    console.error('Error retrieving games:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export game as CSV
app.get('/api/game/:gameId/export', async (req, res) => {
  try {
    const { gameId } = req.params;
    const filepath = path.join(resultsDir, `game_${gameId}.json`);
    
    const data = await fs.readFile(filepath, 'utf8');
    const gameResult = JSON.parse(data);
    
    // Create CSV content
    let csv = 'TechTycoon Game Results\n';
    csv += `Game ID,${gameResult.id}\n`;
    csv += `Team Name,${gameResult.teamName}\n`;
    csv += `Problem,${gameResult.problemId}\n`;
    csv += `Duration,${gameResult.duration} minutes\n`;
    csv += `Date,${new Date(gameResult.timestamp).toLocaleString()}\n\n`;
    
    csv += 'Final Scores\n';
    csv += `Impact,${gameResult.finalScores.impact}\n`;
    csv += `Inclusivity,${gameResult.finalScores.inclusivity}\n`;
    csv += `Trust,${gameResult.finalScores.trust}\n`;
    csv += `Budget,£${gameResult.finalScores.budget}\n\n`;
    
    csv += 'Decisions Made\n';
    csv += 'Stage,Decision\n';
    gameResult.choices.forEach((choice, index) => {
      csv += `${index + 1},"${choice.text}"\n`;
    });
    
    csv += `\nTeam Members\n`;
    gameResult.roles.forEach(role => {
      csv += `${role}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="techtycoon-${gameResult.id}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting game:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`TechTycoon backend running on http://localhost:${PORT}`);
});

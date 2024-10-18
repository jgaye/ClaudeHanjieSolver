import React, { useState, useEffect } from 'react';

const PicrossSolver = () => {
  const [rowClues, setRowClues] = useState([]);
  const [colClues, setColClues] = useState([]);
  const [grid, setGrid] = useState([]);
  const [gridSize, setGridSize] = useState(5);

  useEffect(() => {
    initializeGrid();
  }, [gridSize]);

  const initializeGrid = () => {
    setGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
    setRowClues(Array(gridSize).fill(''));
    setColClues(Array(gridSize).fill(''));
  };

  const parseClues = (clues) => {
    return clues.map(clue => 
      clue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num))
    );
  };

  const solvePicross = () => {
    const parsedRowClues = parseClues(rowClues);
    const parsedColClues = parseClues(colClues);
    
    let newGrid = grid.map(row => [...row]);
    let changed = true;

    while (changed) {
      changed = false;
      for (let i = 0; i < gridSize; i++) {
        const rowResult = solveRow(newGrid[i], parsedRowClues[i]);
        const colResult = solveColumn(newGrid.map(row => row[i]), parsedColClues[i]);
        
        if (rowResult.some((cell, j) => cell !== newGrid[i][j])) {
          newGrid[i] = rowResult;
          changed = true;
        }
        
        if (colResult.some((cell, j) => cell !== newGrid[j][i])) {
          for (let j = 0; j < gridSize; j++) {
            newGrid[j][i] = colResult[j];
          }
          changed = true;
        }
      }
    }

    setGrid(newGrid);
  };

  const solveRow = (row, clues) => {
    let newRow = [...row];
    let position = 0;
    for (let clue of clues) {
      if (position + clue + clues.length - 1 > gridSize) break;
      for (let i = 0; i < clue; i++) {
        newRow[position + i] = 1;
      }
      position += clue + 1;
    }
    return newRow;
  };

  const solveColumn = (column, clues) => {
    return solveRow(column, clues);
  };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Picross Solver</h2>
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '10px'}}>Grid Size:</label>
        <input
          type="number"
          value={gridSize}
          onChange={(e) => setGridSize(parseInt(e.target.value))}
          min="1"
          max="20"
          style={{width: '60px', padding: '5px'}}
        />
      </div>
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '10px'}}>Row Clues (comma-separated):</label>
        {rowClues.map((clue, index) => (
          <input
            key={`row-${index}`}
            value={clue}
            onChange={(e) => {
              const newClues = [...rowClues];
              newClues[index] = e.target.value;
              setRowClues(newClues);
            }}
            style={{display: 'block', width: '100%', marginBottom: '5px', padding: '5px'}}
            placeholder={`Row ${index + 1}`}
          />
        ))}
      </div>
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '10px'}}>Column Clues (comma-separated):</label>
        {colClues.map((clue, index) => (
          <input
            key={`col-${index}`}
            value={clue}
            onChange={(e) => {
              const newClues = [...colClues];
              newClues[index] = e.target.value;
              setColClues(newClues);
            }}
            style={{display: 'block', width: '100%', marginBottom: '5px', padding: '5px'}}
            placeholder={`Column ${index + 1}`}
          />
        ))}
      </div>
      <button 
        onClick={solvePicross} 
        style={{
          display: 'block', 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Solve
      </button>
      <div 
        style={{
          display: 'grid', 
          gap: '1px', 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          backgroundColor: '#ccc',
          padding: '1px'
        }}
      >
        {grid.map((row, i) => 
          row.map((cell, j) => (
            <div 
              key={`${i}-${j}`} 
              style={{
                width: '100%',
                paddingBottom: '100%',
                backgroundColor: cell ? 'black' : 'white'
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PicrossSolver;
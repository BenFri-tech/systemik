import React, { useState } from 'react';
import Figure from './Figure';
import './SystemikBoard.css'; // Importiere die CSS-Datei

const SystemikBoard = () => {
  const [figures, setFigures] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedFigureForLine, setSelectedFigureForLine] = useState(null);
  const [savedBoards, setSavedBoards] = useState([]);
  const [currentBoardName, setCurrentBoardName] = useState('Unbenanntes Brett');

  const addFigure = () => {
    const newFigure = {
      id: `figure-${Date.now()}`,
      initialPosition: { x: 50, y: 50 },
      text: '',
      width: 50,
      height: 80,
    };
    setFigures([...figures, newFigure]);
  };

  const handleDragStop = (id, newPosition, newWidth, newHeight) => {
    setFigures(figures.map(fig => fig.id === id ? { ...fig, initialPosition: newPosition, width: newWidth, height: newHeight } : fig));
  };

  const handleFigureClick = (id) => {
    if (selectedFigureForLine === null) {
      setSelectedFigureForLine(id);
    } else if (selectedFigureForLine !== id) {
      setLines([...lines, { from: selectedFigureForLine, to: id }]);
      setSelectedFigureForLine(null);
    } else {
      setSelectedFigureForLine(null);
    }
  };

  const saveBoard = () => {
    const boardData = { figures, lines };
    const name = prompt("Bitte geben Sie einen Namen für das Brett ein:", currentBoardName);
    if (name) {
      const updatedSavedBoards = [...savedBoards.filter(b => b.name !== name), { name, data: boardData }];
      setSavedBoards(updatedSavedBoards);
      localStorage.setItem('systemikBoards', JSON.stringify(updatedSavedBoards));
      setCurrentBoardName(name);
      alert(`Brett '${name}' erfolgreich gespeichert!`);
    }
  };

  const loadBoard = () => {
    const saved = localStorage.getItem('systemikBoards');
    if (saved) {
      const parsedSavedBoards = JSON.parse(saved);
      setSavedBoards(parsedSavedBoards);
      if (parsedSavedBoards.length > 0) {
        const boardToLoad = prompt("Welches Brett möchten Sie laden? Geben Sie den Namen ein:\n" + parsedSavedBoards.map(b => b.name).join("\n"));
        const selectedBoard = parsedSavedBoards.find(b => b.name === boardToLoad);
        if (selectedBoard) {
          setFigures(selectedBoard.data.figures);
          setLines(selectedBoard.data.lines);
          setCurrentBoardName(selectedBoard.name);
          alert(`Brett '${selectedBoard.name}' geladen!`);
        } else {
          alert("Brett nicht gefunden.");
        }
      } else {
        alert("Keine gespeicherten Bretter gefunden.");
      }
    } else {
      alert("Keine gespeicherten Bretter gefunden.");
    }
  };

  const createNewBoard = () => {
    if (window.confirm("Möchten Sie ein neues, leeres Brett erstellen? Ungespeicherte Änderungen gehen verloren.")) {
      setFigures([]);
      setLines([]);
      setCurrentBoardName('Unbenanntes Brett');
      setSelectedFigureForLine(null);
    }
  };

  const deleteBoard = () => {
    const saved = localStorage.getItem('systemikBoards');
    if (saved) {
      const parsedSavedBoards = JSON.parse(saved);
      if (parsedSavedBoards.length > 0) {
        const boardToDelete = prompt("Welches Brett möchten Sie löschen? Geben Sie den Namen ein:\n" + parsedSavedBoards.map(b => b.name).join("\n"));
        const updatedSavedBoards = parsedSavedBoards.filter(b => b.name !== boardToDelete);
        setSavedBoards(updatedSavedBoards);
        localStorage.setItem('systemikBoards', JSON.stringify(updatedSavedBoards));
        alert(`Brett '${boardToDelete}' wurde gelöscht.`);
        if (currentBoardName === boardToDelete) {
          setFigures([]);
          setLines([]);
          setCurrentBoardName('Unbenanntes Brett');
          setSelectedFigureForLine(null);
        }
      } else {
        alert("Keine Bretter zum Löschen gefunden.");
      }
    } else {
      alert("Keine Bretter zum Löschen gefunden.");
    }
  };

  useState(() => {
    const saved = localStorage.getItem('systemikBoards');
    if (saved) {
      setSavedBoards(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="systemik-board-container">
      <div className="board-controls">
        <button onClick={addFigure}>
          Figur hinzufügen
        </button>
        <button onClick={saveBoard}>
          Brett speichern
        </button>
        <button onClick={loadBoard}>
          Brett laden
        </button>
        <button onClick={createNewBoard}>
          Neues Brett
        </button>
        <button onClick={deleteBoard}>
          Brett löschen
        </button>
        <span className="current-board-name">Aktuelles Brett: {currentBoardName}</span>
      </div>
      <div className="drawing-area">
        {figures.map(figure => (
          <Figure
            key={figure.id}
            id={figure.id}
            initialPosition={figure.initialPosition}
            onDragStop={handleDragStop}
            width={figure.width}
            height={figure.height}
            onClick={handleFigureClick}
            isSelectedForLine={selectedFigureForLine === figure.id}
          />
        ))}

        <svg className="figure-svg-overlay">
          {lines.map((line, index) => {
            const fromFigure = figures.find(fig => fig.id === line.from);
            const toFigure = figures.find(fig => fig.id === line.to);

            if (!fromFigure || !toFigure) return null;

            const x1 = fromFigure.initialPosition.x + fromFigure.width / 2;
            const y1 = fromFigure.initialPosition.y + fromFigure.height / 2;
            const x2 = toFigure.initialPosition.x + toFigure.width / 2;
            const y2 = toFigure.initialPosition.y + toFigure.height / 2;

            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />;
          })}
        </svg>
      </div>
    </div>
  );
};

export default SystemikBoard; 
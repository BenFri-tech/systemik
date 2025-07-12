import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html, TransformControls, Line } from '@react-three/drei';
import * as THREE from 'three';

// LineWithArrow component moved outside SystemikBoard3D
const LineWithArrow = ({ start, end, color = "black", lineWidth = 2 }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];

  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const arrowLength = 0.3;
  const arrowWidth = 0.15;

  const arrowPosition = new THREE.Vector3().subVectors(end, direction.clone().multiplyScalar(0.05));

  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

  return (
    <>
      <Line points={points} color={color} lineWidth={lineWidth} />
      <mesh position={arrowPosition} quaternion={quaternion}>
        <coneGeometry args={[arrowWidth, arrowLength, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  );
};

function Figure3D({ position, size, text, onUpdate, id, mode, onClick, isSelectedForLine }) {
  const meshRef = useRef();
  const [currentText, setCurrentText] = useState(text);

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  return (
    <TransformControls mode={mode} onDraggingChanged={(e) => {
      if (!e.value) {
        const newPos = meshRef.current.position;
        const newScale = meshRef.current.scale;
        onUpdate(id, {
          position: [newPos.x, newPos.y, newPos.z],
          size: [newScale.x, newScale.y, newScale.z],
          text: currentText
        });
      }
    }}>
      <mesh
        ref={meshRef}
        position={position}
        scale={size}
        onClick={() => onClick(id)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelectedForLine ? "red" : "hotpink"} />

        <Html position={[0, 0.6, 0]} center>
          <textarea
            value={currentText}
            onChange={(e) => {
              setCurrentText(e.target.value);
              onUpdate(id, { position, size, text: e.target.value });
            }}
            placeholder="Text eingeben"
            onMouseDown={(e) => e.stopPropagation()} // Prevent click from propagating to parent TransformControls
            style={{
              width: '120px',
              height: '40px',
              border: '1px solid #ccc',
              textAlign: 'center',
              resize: 'none',
              backgroundColor: 'rgba(255,255,255,0.8)',
              outline: 'none',
              padding: '5px',
              borderRadius: '5px',
              fontSize: '12px',
            }}
          />
        </Html>
      </mesh>
    </TransformControls>
  );
}

function SystemikBoard3D() {
  const [figures, setFigures] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedFigureForLine, setSelectedFigureForLine] = useState(null);
  const [activeControlMode, setActiveControlMode] = useState('translate');
  const [savedBoards, setSavedBoards] = useState([]);
  const [currentBoardName, setCurrentBoardName] = useState('Unbenanntes Brett (3D)');

  const addFigure = () => {
    const newFigure = {
      id: `figure-${Date.now()}`,
      position: [0, 0, 0],
      size: [1, 1, 1],
      text: '',
    };
    setFigures([...figures, newFigure]);
  };

  const handleFigureUpdate = (id, updatedProps) => {
    setFigures(figures.map(fig => fig.id === id ? { ...fig, ...updatedProps } : fig));
  };

  const handleFigureClick = (id) => {
    if (activeControlMode === 'translate' || activeControlMode === 'scale') {
      return;
    }

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
    const name = prompt("Bitte geben Sie einen Namen für das 3D-Brett ein:", currentBoardName);
    if (name) {
      const updatedSavedBoards = [...savedBoards.filter(b => b.name !== name), { name, data: boardData }];
      setSavedBoards(updatedSavedBoards);
      localStorage.setItem('systemik3DBoards', JSON.stringify(updatedSavedBoards));
      setCurrentBoardName(name);
      alert(`3D-Brett '${name}' erfolgreich gespeichert!`);
    }
  };

  const loadBoard = () => {
    const saved = localStorage.getItem('systemik3DBoards');
    if (saved) {
      const parsedSavedBoards = JSON.parse(saved);
      setSavedBoards(parsedSavedBoards);
      if (parsedSavedBoards.length > 0) {
        const boardToLoad = prompt("Welches 3D-Brett möchten Sie laden? Geben Sie den Namen ein:\n" + parsedSavedBoards.map(b => b.name).join("\n"));
        const selectedBoard = parsedSavedBoards.find(b => b.name === boardToLoad);
        if (selectedBoard) {
          setFigures(selectedBoard.data.figures);
          setLines(selectedBoard.data.lines);
          setCurrentBoardName(selectedBoard.name);
          alert(`3D-Brett '${selectedBoard.name}' geladen!`);
        } else {
          alert("3D-Brett nicht gefunden.");
        }
      } else {
        alert("Keine gespeicherten 3D-Bretter gefunden.");
      }
    } else {
      alert("Keine gespeicherten 3D-Bretter gefunden.");
    }
  };

  const createNewBoard = () => {
    if (window.confirm("Möchten Sie ein neues, leeres 3D-Brett erstellen? Ungespeicherte Änderungen gehen verloren.")) {
      setFigures([]);
      setLines([]);
      setCurrentBoardName('Unbenanntes Brett (3D)');
      setSelectedFigureForLine(null);
    }
  };

  const deleteBoard = () => {
    const saved = localStorage.getItem('systemik3DBoards');
    if (saved) {
      const parsedSavedBoards = JSON.parse(saved);
      if (parsedSavedBoards.length > 0) {
        const boardToDelete = prompt("Welches 3D-Brett möchten Sie löschen? Geben Sie den Namen ein:\n" + parsedSavedBoards.map(b => b.name).join("\n"));
        const updatedSavedBoards = parsedSavedBoards.filter(b => b.name !== boardToDelete);
        setSavedBoards(updatedSavedBoards);
        localStorage.setItem('systemik3DBoards', JSON.stringify(updatedSavedBoards));
        alert(`3D-Brett '${boardToDelete}' wurde gelöscht.`);
        if (currentBoardName === boardToDelete) {
          setFigures([]);
          setLines([]);
          setCurrentBoardName('Unbenanntes Brett (3D)');
          setSelectedFigureForLine(null);
        }
      } else {
        alert("Keine 3D-Bretter zum Löschen gefunden.");
      }
    } else {
      alert("Keine 3D-Bretter zum Löschen gefunden.");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('systemik3DBoards');
    if (saved) {
      setSavedBoards(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px',
        }}
      >
        <button
          onClick={addFigure}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Figur hinzufügen (3D)
        </button>
        <button
          onClick={() => setActiveControlMode('translate')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeControlMode === 'translate' ? '#0056b3' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Verschieben
        </button>
        <button
          onClick={() => setActiveControlMode('scale')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeControlMode === 'scale' ? '#0056b3' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Größe ändern
        </button>
        <button
          onClick={() => {
            setActiveControlMode('none'); // Deactivate transform controls for line drawing
            setSelectedFigureForLine(null);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: activeControlMode === 'none' ? '#0056b3' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Linie zeichnen
        </button>
        <button
          onClick={saveBoard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Brett speichern (3D)
        </button>
        <button
          onClick={loadBoard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Brett laden (3D)
        </button>
        <button
          onClick={createNewBoard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Neues Brett (3D)
        </button>
        <button
          onClick={deleteBoard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Brett löschen (3D)
        </button>
        <span style={{ marginLeft: 'auto', color: 'white', fontWeight: 'bold' }}>Aktuelles Brett: {currentBoardName}</span>
      </div>
      {figures.map((figure) => (
        <Figure3D
          key={figure.id}
          id={figure.id}
          position={figure.position}
          size={figure.size}
          text={figure.text}
          onUpdate={handleFigureUpdate}
          mode={activeControlMode === 'none' ? undefined : activeControlMode}
          onClick={handleFigureClick}
          isSelectedForLine={selectedFigureForLine === figure.id}
        />
      ))}

      {lines.map((line, index) => {
        const fromFigure = figures.find(fig => fig.id === line.from);
        const toFigure = figures.find(fig => fig.id === line.to);

        if (!fromFigure || !toFigure) return null;

        return (
          <LineWithArrow
            key={index}
            start={fromFigure.position}
            end={toFigure.position}
            color="black"
            lineWidth={2}
          />
        );
      })}
    </>
  );
}

export default SystemikBoard3D; 
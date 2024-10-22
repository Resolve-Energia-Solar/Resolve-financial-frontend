import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Button, Dialog, DialogContent } from '@mui/material';

// Exemplo de array de objetos
const db = [
  {
    name: 'Kevin',
    url: 'https://i.ibb.co/9rQ3hq7/kevin-e-henrique.jpg'
  },
  {
    name: 'Henrique',
    url: 'https://i.ibb.co/9rQ3hq7/kevin-e-henrique.jpg'
  },
  {
    name: 'John Doe',
    url: 'https://i.ibb.co/9rQ3hq7/kevin-e-henrique.jpg'
  },
  // Adicione mais objetos conforme necessário
];

const SwipeCard = () => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState(null);
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(() => Array(db.length).fill(0).map(() => React.createRef()), []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    currentIndexRef.current = currentIndex;

    // Atualiza o índice atual se a carta foi descartada
    if (currentIndex === index) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
  };

  const swipe = async (dir) => {
    if (currentIndex >= 0) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  const goBack = async () => {
    if (currentIndex < db.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      await childRefs[newIndex].current.restoreCard();
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Modo Trabalho
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', width: '300px', height: '400px' }}>
            {db.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                key={character.name}
                onSwipe={(dir) => swiped(dir, character.name, index)}
                onCardLeftScreen={() => outOfFrame(character.name, index)}
                preventSwipe={[]}
              >
                <div
                  style={{
                    width: '300px',
                    height: '400px',
                    backgroundImage: `url(${character.url})`,
                    backgroundSize: 'cover',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    color: 'white',
                    padding: '10px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transition: '0.3s',
                  }}
                >
                  <h3>{character.name}</h3>
                </div>
              </TinderCard>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Button variant="contained" color="secondary" onClick={() => swipe('left')} disabled={currentIndex < 0}>
              Swipe Left
            </Button>
            <Button variant="contained" color="secondary" onClick={goBack} disabled={currentIndex >= db.length - 1}>
              Undo Swipe
            </Button>
            <Button variant="contained" color="secondary" onClick={() => swipe('right')} disabled={currentIndex < 0}>
              Swipe Right
            </Button>
          </div>

          {lastDirection ? (
            <h2 className='infoText'>
              You swiped {lastDirection}
            </h2>
          ) : (
            <h2 className='infoText'>
              Swipe a card or press a button!
            </h2>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SwipeCard;

import React, { useState, useEffect, useRef } from 'react';
import ./countdown.css

const HiddenChronometer = () => {
  const [timeLeft, setTimeLeft] = useState(604800); // 7 days in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [showInspect, setShowInspect] = useState(false);
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const timerRef = useRef(null);

  // Format time as days:hours:minutes:seconds
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsRunning(false);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'i' || e.key === 'I') {
        setShowInspect(prev => !prev);
      }
      if (e.key === 'h' || e.key === 'H') {
        setHintUsed(true);
      }
      if (e.key === 'Escape') {
        setShowInspect(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleInspectClick = () => {
    setShowInspect(true);
  };

  const handleElementInspect = (elementName) => {
    if (elementName === 'timer-element') {
      setFlagRevealed(true);
    }
  };

  return (
    <div className="hidden-chronometer" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
        ⏳ The Hidden Chronometer
      </h1>

      <div style={{ margin: '30px 0', textAlign: 'center' }}>
        <p style={{ fontStyle: 'italic', color: '#7f8c8d', fontSize: '18px' }}>
          "Time reveals what it first conceals."
        </p>
        <p style={{ fontStyle: 'italic', color: '#7f8c8d', fontSize: '18px' }}>
          "I count backward toward the Oracle's final awakening."
        </p>
        <p style={{ fontStyle: 'italic', color: '#7f8c8d', fontSize: '18px' }}>
          "Find me where moments are measured and futures are anticipated."
        </p>
      </div>

      {hintUsed && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '15px', 
          borderRadius: '5px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <strong>Hint:</strong> "My path is /countdown but my secret lies behind the digits."
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <div 
          id="timer-element"
          data-flag="FLAG{behind_the_curtain}"
          style={{
            fontSize: '3rem',
            fontFamily: 'monospace',
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '20px',
            borderRadius: '10px',
            display: 'inline-block',
            minWidth: '400px',
            position: 'relative',
            cursor: 'pointer',
            border: '2px solid #34495e'
          }}
          onClick={handleInspectClick}
          title="Click to inspect or press 'I'"
        >
          {formatTime(timeLeft)}
          <div style={{
            position: 'absolute',
            top: '5px',
            right: '10px',
            fontSize: '1rem',
            opacity: '0.6'
          }}>
            ⓘ
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: isRunning ? '#e74c3c' : '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Resume'}
          </button>
          
          <button 
            onClick={() => setTimeLeft(604800)}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset
          </button>

          <button 
            onClick={() => setHintUsed(true)}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💡 Hint
          </button>
        </div>
      </div>

      {showInspect && (
        <div style={{
          border: '2px solid #3498db',
          borderRadius: '10px',
          padding: '20px',
          backgroundColor: '#ecf0f1',
          marginTop: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>🔍 Developer Inspector</h3>
            <button 
              onClick={() => setShowInspect(false)}
              style={{ 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px', 
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', minHeight: '300px' }}>
            {/* Elements Panel */}
            <div style={{ flex: 1, backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
              <h4 style={{ marginTop: 0 }}>Elements</h4>
              <div 
                style={{ 
                  padding: '10px', 
                  backgroundColor: '#3498db', 
                  color: 'white', 
                  borderRadius: '3px',
                  marginBottom: '5px',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
                onClick={() => handleElementInspect('timer-element')}
              >
                &lt;div id="timer-element" data-flag="FLAG{behind_the_curtain}"&gt;
              </div>
              <div style={{ padding: '10px', marginLeft: '20px', fontFamily: 'monospace' }}>
                &lt;div class="timer-display"&gt;{formatTime(timeLeft)}&lt;/div&gt;
              </div>
              <div style={{ padding: '10px', marginLeft: '20px', fontFamily: 'monospace' }}>
                &lt;span class="info-icon"&gt;ⓘ&lt;/span&gt;
              </div>
              <div style={{ padding: '10px', fontFamily: 'monospace' }}>
                &lt;/div&gt;
              </div>
            </div>

            {/* Properties Panel */}
            <div style={{ flex: 1, backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
              <h4 style={{ marginTop: 0 }}>Properties</h4>
              {flagRevealed ? (
                <div>
                  <p><strong>Selected Element:</strong> #timer-element</p>
                  <div style={{ 
                    backgroundColor: '#2ecc71', 
                    color: 'white', 
                    padding: '15px', 
                    borderRadius: '5px',
                    marginTop: '10px',
                    fontFamily: 'monospace'
                  }}>
                    <strong>Custom Data Attribute:</strong><br/>
                    data-flag: "FLAG{behind_the_curtain}"
                  </div>
                  <div style={{ 
                    backgroundColor: '#f39c12', 
                    color: 'white', 
                    padding: '15px', 
                    borderRadius: '5px',
                    marginTop: '20px'
                  }}>
                    <h4>🎉 Puzzle Solved!</h4>
                    <p><strong>Flag:</strong> FLAG{behind_the_curtain}</p>
                    <p><strong>Answer:</strong> behind_the_curtain</p>
                    <p><strong>Points:</strong> 200</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Click on an element in the Elements panel to inspect its properties.</p>
                  <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>
                    Hint: Look for hidden data attributes in the timer element.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#7f8c8d' }}>
            <p><strong>Tip:</strong> In a real browser, you'd use F12 or Right-click → Inspect to find hidden data.</p>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        textAlign: 'center'
      }}>
        <h4>How to Solve:</h4>
        <ol style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Press 'I' or click the timer to open the inspector</li>
          <li>Click on the timer element in the Elements panel</li>
          <li>Look for hidden data attributes in the properties</li>
          <li>Find the flag hidden "behind the curtain" of the timer</li>
        </ol>
      </div>
    </div>
  );
};

export default HiddenChronometer;

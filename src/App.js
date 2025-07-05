import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Lock,
  Unlock,
  ArrowRight,
  Plus,
  Equal,
  BookOpen,
  Code,
} from "lucide-react";

// --- Helper Components for Detailed Visualizations ---
const CoreMixingVisualizer = ({ currentStep, roundType, currentRoundNum, highlightedIndices }) => {
  if (currentStep !== 1) return null;
  
  let displayText;
  if (roundType === 'initial') {
    displayText = "Initial State - Ready for Mixing";
  } else if (roundType === 'column') {
    displayText = `Column Round ${currentRoundNum}/10 - Completed`;
  } else if (roundType === 'diagonal') {
    displayText = `Diagonal Round ${currentRoundNum}/10 - Completed`;
  } else {
    displayText = "Mixing Process";
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-600 mb-4">Core Mixing Pattern</h3>
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <p className="text-center font-mono mb-3 text-orange-600">{displayText}</p>
        <div className="grid grid-cols-4 gap-2 w-full max-w-xs mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isHighlighted = highlightedIndices.includes(i);
            return <div key={i} className={`aspect-square rounded-md transition-all duration-100 ease-in-out ${isHighlighted ? 'bg-orange-400 animate-pulse' : 'bg-gray-300'}`}></div>;
          })}
        </div>
      </div>
    </div>
  );
};

const MatrixDisplay = ({ matrix, title }) => (
  <div className="text-center">
    <p className="font-mono text-sm text-gray-600 mb-2">{title}</p>
    <div className="grid grid-cols-4 gap-1 bg-white border border-gray-200 p-2 rounded-md">
      {(matrix.length > 0 ? matrix : Array(16).fill(0)).map((val, i) => (
        <div key={i} className="bg-gray-100 rounded p-1 text-xs break-all text-gray-800">
          {val.toString(16).padStart(8, '0')}
        </div>
      ))}
    </div>
  </div>
);

const AdditionVisualizer = ({ currentStep, mixedState, initialState, resultState }) => {
  if (currentStep !== 2) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-600 mb-4">State Addition</h3>
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center justify-around gap-2 animate-fade-in">
        <MatrixDisplay matrix={mixedState} title="Mixed State" />
        <Plus className="text-orange-500 w-6 h-6 flex-shrink-0" />
        <MatrixDisplay matrix={initialState} title="Initial State" />
        <Equal className="text-green-500 w-6 h-6 flex-shrink-0" />
        <MatrixDisplay matrix={resultState} title="Result State" />
      </div>
    </div>
  );
};

const KeystreamVisualizer = ({ currentStep, keystreamBytes }) => {
  if (currentStep < 3) return null;
  return (
    <div className={`transition-opacity duration-500 ${currentStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-lg font-semibold text-cyan-600 mb-4">Serialization to Keystream</h3>
      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-xs text-gray-700">
        <div className="grid grid-cols-16 gap-1">
          {(keystreamBytes.length > 0 ? keystreamBytes : Array(64).fill(0)).map((byte, i) => (
            <span key={i} className={`p-1 rounded transition-colors duration-300 ${currentStep === 3 ? 'bg-blue-300 animate-pulse' : 'bg-blue-200'} text-gray-800`}>
              {byte.toString(16).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const XorVisualizer = ({ currentStep, keystreamBytes, plaintextBytes, ciphertextBytes, isDecrypting }) => {
  if (currentStep !== 4) return null;
  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-semibold text-cyan-600 mb-4">XOR Operation</h3>
      <div className="space-y-4 font-mono text-xs">
        <div>
          <p className="text-gray-600 mb-2">{isDecrypting ? "Ciphertext Bytes" : "Plaintext Bytes"}</p>
          <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg grid grid-cols-16 gap-1">
            {plaintextBytes.map((b, i) => <span key={i} className="p-1 rounded bg-purple-200 text-gray-800">{b.toString(16).padStart(2, '0')}</span>)}
          </div>
        </div>
        <div className="flex justify-center text-green-500 font-bold text-2xl">⊕</div>
        <div>
          <p className="text-gray-600 mb-2">Keystream Bytes</p>
          <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg grid grid-cols-16 gap-1">
            {keystreamBytes.map((b, i) => <span key={i} className="p-1 rounded bg-blue-200 text-gray-800">{b.toString(16).padStart(2, '0')}</span>)}
          </div>
        </div>
        <div className="flex justify-center text-green-500 font-bold text-2xl">=</div>
        <div>
          <p className="text-green-600 mb-2">{isDecrypting ? "Plaintext Bytes" : "Ciphertext Bytes"}</p>
          <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg grid grid-cols-16 gap-1">
            {ciphertextBytes.map((b, i) => <span key={i} className="p-1 rounded bg-green-200 animate-pulse text-gray-800">{b.toString(16).padStart(2, '0')}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Theory Components ---
const TheoryTab = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
        <BookOpen className="w-6 h-6 mr-3" /> What is Salsa20?
      </h2>
      <div className="space-y-4 text-gray-700">
        <p>
          Salsa20 is a stream cipher developed by Daniel J. Bernstein. It's designed to be fast, secure, and simple to implement.
          It's the predecessor to the ChaCha20 cipher and forms the foundation for many modern cryptographic protocols.
        </p>
        <p>
          The "20" in Salsa20 refers to the 20 rounds of mixing (10 column rounds and 10 diagonal rounds) performed on the internal state,
          similar to ChaCha20 but with different quarter round operations.
        </p>
        <p>
          Salsa20 was one of the finalists in the eSTREAM project and has been extensively analyzed by the cryptographic community.
        </p>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center">
        <Code className="w-6 h-6 mr-3" /> How It Works
      </h2>
      <div className="space-y-4 text-gray-700">
        <h3 className="font-semibold text-green-600">1. Initialization</h3>
        <p>
          The cipher starts with a 4×4 matrix of 32-bit words (16 words total). This includes:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>4 constants ("expand 32-byte k" in ASCII: 0x61707865, 0x3320646e, 0x79622d32, 0x6b206574)</li>
          <li>8 words (256 bits) of key material</li>
          <li>2 words (64 bits) of nonce</li>
          <li>2 words (64 bits) of block counter</li>
        </ul>

        <h3 className="font-semibold text-green-600">2. The Quarter Round</h3>
        <p>
          The core operation is the quarter round, which mixes four 32-bit words (a, b, c, d) using ARX (Add-Rotate-XOR) operations.
          This differs from ChaCha20 in the rotation amounts:
        </p>
        <pre className="bg-gray-100 border border-gray-200 p-3 rounded-md text-xs font-mono overflow-x-auto text-gray-800">
          {`b ^= (a + d) <<< 7;
c ^= (b + a) <<< 9;
d ^= (c + b) <<< 13;
a ^= (d + c) <<< 18;`}
        </pre>

        <h3 className="font-semibold text-green-600">3. The Salsa Block Function</h3>
        <p>
          The block function performs 20 rounds of mixing (10 column rounds and 10 diagonal rounds), then adds the result to the original matrix.
        </p>

        <h3 className="font-semibold text-green-600">4. Generating the Keystream</h3>
        <p>
          The final matrix is serialized into a 64-byte keystream block. This is XORed with the plaintext to produce ciphertext.
        </p>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Security Properties</h2>
      <div className="space-y-4 text-gray-700">
        <p>
          Salsa20 is designed to be:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Secure</strong>: No practical attacks are known against the full 20-round version</li>
          <li><strong>Fast</strong>: Performs well on both hardware and software implementations</li>
          <li><strong>Simple</strong>: Easy to implement and understand</li>
          <li><strong>Flexible</strong>: Supports 256-bit keys and 64-bit nonces</li>
        </ul>
        <p>
          Salsa20 has been extensively analyzed and is considered secure. It served as the foundation for ChaCha20, which improved upon some aspects.
        </p>
      </div>
    </div>
  </div>
);

// --- Example Tab ---
const ExampleTab = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">Standard Test Vectors</h2>
      <div className="space-y-4 text-gray-700">
        <p>Here are some standard test vectors for Salsa20:</p>
        
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
          <h3 className="font-semibold text-blue-600 mb-2">Test Vector #1</h3>
          <p><strong>Key:</strong> 000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f</p>
          <p><strong>Nonce:</strong> 0000000000000000</p>
          <p><strong>Block Counter:</strong> 0</p>
          <p><strong>Expected Output (first 64 bytes):</strong> e3be8fdd8beca2e3ea8ef9475b29a6e7003951e1097a5c38d23b7a5fad9f6844b22c97559e2723c7cbbd3fe4fc8d9a0744652a83e72a9c461876af4d7ef1a117</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
          <h3 className="font-semibold text-blue-600 mb-2">Test Vector #2</h3>
          <p><strong>Key:</strong> 0f62b5085bae0154a7fa4da0f34699ec3f92e5388bde3184d72a7dd02376c91c</p>
          <p><strong>Nonce:</strong> 288ff65dc42b92f9</p>
          <p><strong>Plaintext:</strong> "Hello, World!"</p>
          <p><strong>Expected Ciphertext:</strong> 5e5e71f90199340304aba2ee</p>
        </div>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Common Uses</h2>
      <div className="space-y-4 text-gray-700">
        <p>Salsa20 has been used in various cryptographic applications:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>NaCl (Networking and Cryptography library)</li>
          <li>libsodium cryptographic library</li>
          <li>Various VPN implementations</li>
          <li>Secure file encryption tools</li>
          <li>Academic research and education</li>
        </ul>
        <p>While ChaCha20 has largely superseded Salsa20 in modern applications, Salsa20 remains an important cipher for understanding stream cipher design principles.</p>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const Salsa20Interactive = () => {
  const [activeTab, setActiveTab] = useState("cipher");
  const [input, setInput] = useState("This is a secret message.");
  const [key, setKey] = useState("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f");
  const [nonce, setNonce] = useState("0000000000000000");
  const [output, setOutput] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [matrix, setMatrix] = useState([]);
  const [isDecrypting, setIsDecrypting] = useState(false);
 
  // State for detailed visualizations
  const [roundType, setRoundType] = useState('');
  const [currentRoundNum, setCurrentRoundNum] = useState(0);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [initialStateForViz, setInitialStateForViz] = useState([]);
  const [mixedStateForViz, setMixedStateForViz] = useState([]);
  const [keystreamBytesForViz, setKeystreamBytesForViz] = useState([]);
  const [plaintextBytesForViz, setPlaintextBytesForViz] = useState([]);
  const [ciphertextBytesForViz, setCiphertextBytesForViz] = useState([]);
 
  // Ref to correctly handle animation interruption
  // (keeping for potential future use, though not needed for manual navigation)

  const CONSTANTS = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];

  // --- Core Salsa20 Logic & Helpers ---
  const rotl = (a, b) => (a << b) | (a >>> (32 - b));
  const quarterRound = (a, b, c, d) => {
    // Salsa20 quarter round function (different from ChaCha20)
    b = (b ^ rotl((a + d) >>> 0, 7)) >>> 0;
    c = (c ^ rotl((b + a) >>> 0, 9)) >>> 0;
    d = (d ^ rotl((c + b) >>> 0, 13)) >>> 0;
    a = (a ^ rotl((d + c) >>> 0, 18)) >>> 0;
    return [a, b, c, d];
  };
  const hexToBytes = (hex) => { 
    const bytes = []; 
    for (let i = 0; i < hex.length; i += 2) { 
      bytes.push(parseInt(hex.substr(i, 2), 16)); 
    } 
    return bytes; 
  };
  const bytesToHex = (bytes) => bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  const stringToBytes = (str) => Array.from(new TextEncoder().encode(str));
  const bytesToString = (bytes) => new TextDecoder().decode(new Uint8Array(bytes));
  const formatMatrixForDisplay = (matrix) => {
    if (!matrix || !matrix.length) return Array(4).fill(Array(4).fill(0));
    const formatted = [];
    for (let i = 0; i < 4; i++) {
      formatted.push(matrix.slice(i * 4, (i + 1) * 4));
    }
    return formatted;
  };

  const initMatrix = (counter = 0) => {
    const keyBytes = hexToBytes(key.padEnd(64, "0").slice(0, 64));
    const nonceBytes = hexToBytes(nonce.padEnd(16, "0").slice(0, 16)); // Salsa20 uses 64-bit nonce
    const newMatrix = Array(16);
    
    // Salsa20 constants: "expand 32-byte k" in ASCII
    newMatrix[0] = CONSTANTS[0]; newMatrix[1] = CONSTANTS[1]; newMatrix[2] = CONSTANTS[2]; newMatrix[3] = CONSTANTS[3];
    
    // Key (8 words = 256 bits)
    for (let i = 0; i < 8; i++) { 
      newMatrix[4 + i] = (keyBytes[i * 4] | (keyBytes[i * 4 + 1] << 8) | (keyBytes[i * 4 + 2] << 16) | (keyBytes[i * 4 + 3] << 24)) >>> 0; 
    }
    
    // Nonce (2 words = 64 bits) - positions 12 and 13
    for (let i = 0; i < 2; i++) { 
      newMatrix[12 + i] = (nonceBytes[i * 4] | (nonceBytes[i * 4 + 1] << 8) | (nonceBytes[i * 4 + 2] << 16) | (nonceBytes[i * 4 + 3] << 24)) >>> 0; 
    }
    
    // Block counter (2 words = 64 bits) - positions 14 and 15
    newMatrix[14] = counter & 0xffffffff;
    newMatrix[15] = (counter >>> 32) & 0xffffffff;
    
    return newMatrix;
  };

  // --- Step Navigation Logic ---
  // State to store computed values for each step
  const [stepData, setStepData] = useState({
    initialMatrix: [],
    mixedMatrix: [],
    finalMatrix: [],
    keystreamBytes: [],
    inputBytes: [],
    resultBytes: [],
    mixingStates: [] // Array of all 20 mixing round states
  });
  
  // State for manual mixing round navigation
  const [currentMixingRound, setCurrentMixingRound] = useState(0);

  // Function to execute the complete algorithm and store intermediate results
  const computeAllSteps = (decrypt = false) => {
    // Step 0: Initialize Matrix
    const initialMatrix = initMatrix(0);
    let workingMatrix = [...initialMatrix];

    // Step 1: Mix State (20 Rounds) - Store all intermediate states
    const columnGroups = [[0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15]];
    const diagonalGroups = [[0, 5, 10, 15], [1, 6, 11, 12], [2, 7, 8, 13], [3, 4, 9, 14]];
    const mixingStates = [];
    
    // Store initial state as round 0
    mixingStates.push([...workingMatrix]);

    for (let i = 0; i < 10; i++) {
      // Column rounds
      for (const group of columnGroups) {
        [workingMatrix[group[0]], workingMatrix[group[1]], workingMatrix[group[2]], workingMatrix[group[3]]] = 
          quarterRound(workingMatrix[group[0]], workingMatrix[group[1]], workingMatrix[group[2]], workingMatrix[group[3]]);
      }
      mixingStates.push([...workingMatrix]); // Store state after column round
      
      // Diagonal rounds
      for (const group of diagonalGroups) {
        [workingMatrix[group[0]], workingMatrix[group[1]], workingMatrix[group[2]], workingMatrix[group[3]]] = 
          quarterRound(workingMatrix[group[0]], workingMatrix[group[1]], workingMatrix[group[2]], workingMatrix[group[3]]);
      }
      mixingStates.push([...workingMatrix]); // Store state after diagonal round
    }
    const mixedMatrix = [...workingMatrix];

    // Step 2: Add Initial State
    for (let i = 0; i < 16; i++) { 
      workingMatrix[i] = (workingMatrix[i] + initialMatrix[i]) >>> 0; 
    }
    const finalMatrix = [...workingMatrix];

    // Step 3: Serialize to Keystream
    const keystream = workingMatrix;
    const keystreamBytes = [];
    for (let j = 0; j < 16; j++) {
      keystreamBytes.push(keystream[j] & 0xff, (keystream[j] >>> 8) & 0xff, (keystream[j] >>> 16) & 0xff, (keystream[j] >>> 24) & 0xff);
    }
    const finalKeystreamBytes = keystreamBytes.slice(0, 64);

    // Step 4: XOR Operation
    let inputBytes;
    if (decrypt) {
      const cleanHex = input.replace(/[^0-9a-f]/gi, '');
      const maxBytes = Math.floor(cleanHex.length / 2);
      inputBytes = hexToBytes(cleanHex.slice(0, maxBytes * 2));
    } else {
      inputBytes = stringToBytes(input);
    }
    
    const bytesToProcess = Math.min(inputBytes.length, finalKeystreamBytes.length);
    const resultBytes = inputBytes.slice(0, bytesToProcess).map((byte, i) => byte ^ finalKeystreamBytes[i]);

    // Store all computed data
    setStepData({
      initialMatrix,
      mixedMatrix,
      finalMatrix,
      keystreamBytes: finalKeystreamBytes,
      inputBytes,
      resultBytes,
      mixingStates
    });

    return { initialMatrix, mixedMatrix, finalMatrix, keystreamBytes: finalKeystreamBytes, inputBytes, resultBytes, decrypt, mixingStates };
  };

  // Function to navigate to a specific step
  const navigateToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    
    // Compute all steps if not already done or if decrypt mode changed
    const computed = computeAllSteps(isDecrypting);
    
    // Set visualization state based on the current step
    switch (stepIndex) {
      case 0: // Initialize State
        setMatrix(computed.initialMatrix);
        setInitialStateForViz(computed.initialMatrix);
        setMixedStateForViz([]);
        setKeystreamBytesForViz([]);
        setPlaintextBytesForViz([]);
        setCiphertextBytesForViz([]);
        setOutput("");
        setHighlightedIndices([]);
        setRoundType('');
        setCurrentRoundNum(0);
        break;
        
      case 1: // Mix State (20 Rounds)
        // Reset to first mixing round when entering step 1 (unless already set)
        if (currentMixingRound >= computed.mixingStates.length) {
          setCurrentMixingRound(0);
        }
        
        // Show the current mixing round state
        const roundIndex = currentMixingRound < computed.mixingStates.length ? currentMixingRound : 0;
        const currentState = computed.mixingStates[roundIndex] || computed.initialMatrix;
        setMatrix(currentState);
        setInitialStateForViz(computed.initialMatrix);
        setMixedStateForViz(computed.mixedMatrix);
        setKeystreamBytesForViz([]);
        setPlaintextBytesForViz([]);
        setCiphertextBytesForViz([]);
        setOutput("");
        setHighlightedIndices([]);
        
        // Show which round type we're in
        if (roundIndex === 0) {
          setRoundType('initial');
          setCurrentRoundNum(0);
        } else if (roundIndex % 2 === 1) {
          setRoundType('column');
          setCurrentRoundNum(Math.ceil(roundIndex / 2));
        } else {
          setRoundType('diagonal');
          setCurrentRoundNum(roundIndex / 2);
        }
        break;
        
      case 2: // Add Initial State
        setMatrix(computed.finalMatrix);
        setInitialStateForViz(computed.initialMatrix);
        setMixedStateForViz(computed.mixedMatrix);
        setKeystreamBytesForViz([]);
        setPlaintextBytesForViz([]);
        setCiphertextBytesForViz([]);
        setOutput("");
        setHighlightedIndices([]);
        setRoundType('');
        setCurrentRoundNum(0);
        break;
        
      case 3: // Serialize to Keystream
        setMatrix(computed.finalMatrix);
        setInitialStateForViz(computed.initialMatrix);
        setMixedStateForViz(computed.mixedMatrix);
        setKeystreamBytesForViz(computed.keystreamBytes);
        setPlaintextBytesForViz([]);
        setCiphertextBytesForViz([]);
        setOutput("");
        setHighlightedIndices([]);
        setRoundType('');
        setCurrentRoundNum(0);
        break;
        
      case 4: // XOR Operation
        setMatrix(computed.finalMatrix);
        setInitialStateForViz(computed.initialMatrix);
        setMixedStateForViz(computed.mixedMatrix);
        setKeystreamBytesForViz(computed.keystreamBytes);
        setPlaintextBytesForViz(computed.inputBytes);
        setCiphertextBytesForViz(computed.resultBytes);
        setHighlightedIndices([]);
        setRoundType('');
        setCurrentRoundNum(0);
        
        // Set output
        if (computed.decrypt) {
          try {
            const decryptedText = bytesToString(computed.resultBytes);
            const cleanText = decryptedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
            setOutput(cleanText.trim());
          } catch (error) {
            setOutput(bytesToHex(computed.resultBytes));
          }
        } else {
          setOutput(bytesToHex(computed.resultBytes));
        }
        break;
        
      default:
        setCurrentStep(-1);
        resetVisualization(false);
        break;
    }
  };

  // Function to start the process (just navigate to step 0)
  const startProcess = (decrypt = false) => {
    setIsDecrypting(decrypt);
    setCurrentMixingRound(0); // Reset mixing round navigation
    navigateToStep(0);
  };

  // Function to navigate within mixing rounds (for step 1)
  const navigateToMixingRound = (roundIndex) => {
    setCurrentMixingRound(roundIndex);
    if (currentStep === 1 && stepData.mixingStates.length > 0) {
      // Update the matrix to show the current mixing round state
      const currentState = stepData.mixingStates[roundIndex] || stepData.initialMatrix;
      setMatrix(currentState);
      
      // Update round type and number based on the round index
      if (roundIndex === 0) {
        setRoundType('initial');
        setCurrentRoundNum(0);
      } else if (roundIndex % 2 === 1) {
        setRoundType('column');
        setCurrentRoundNum(Math.ceil(roundIndex / 2));
      } else {
        setRoundType('diagonal');
        setCurrentRoundNum(roundIndex / 2);
      }
    }
  };
  const resetVisualization = () => {
    setOutput(""); 
    setCurrentStep(-1); 
    setMatrix([]);
    setRoundType('');
    setCurrentRoundNum(0);
    setCurrentMixingRound(0); // Reset mixing round navigation
    setHighlightedIndices([]);
    setInitialStateForViz([]);
    setMixedStateForViz([]);
    setKeystreamBytesForViz([]);
    setPlaintextBytesForViz([]);
    setCiphertextBytesForViz([]);
    setStepData({
      initialMatrix: [],
      mixedMatrix: [],
      finalMatrix: [],
      keystreamBytes: [],
      inputBytes: [],
      resultBytes: [],
      mixingStates: []
    });
  };

  const steps = ["Initialize State", "Mix State (20 Rounds)", "Add Initial State", "Serialize to Keystream", "XOR Operation"];

  // --- Render Method ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">Salsa20 Stream Cipher</h1>
          <p className="text-lg text-gray-600">An Interactive Guide to a Modern Stream Cipher</p>
        </header>
        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 flex space-x-1 shadow-md border">
            {["cipher", "theory", "example"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-4 py-2 md:px-6 md:py-3 rounded-md font-medium transition-all text-sm md:text-base ${activeTab === tab ? "bg-purple-600 text-white shadow-lg" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </nav>
        <main>
          {activeTab === "cipher" && (
            <section className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-2xl border">
                  <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
                    <Lock className="w-6 h-6 mr-3" />
                    {isDecrypting ? "Decryption Controls" : "Encryption Controls"}
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isDecrypting ? "Ciphertext (Hex)" : "Plaintext Message"}
                      </label>
                      <textarea 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" 
                        rows="4" 
                        placeholder={isDecrypting ? "Enter hex ciphertext..." : "Enter your message..."}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">256-bit Key (64 hex chars)</label>
                      <input 
                        type="text" 
                        value={key} 
                        onChange={(e) => setKey(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition" 
                        maxLength="64" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">64-bit Nonce (16 hex chars)</label>
                      <input 
                        type="text" 
                        value={nonce} 
                        onChange={(e) => setNonce(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition" 
                        maxLength="16" 
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => startProcess(false)} 
                        disabled={isDecrypting} 
                        className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center shadow-lg hover:shadow-purple-500/20 ${isDecrypting ? 'opacity-50' : ''}`}
                      >
                        <><Play className="w-5 h-5 mr-2" /> Encryption</>
                      </button>
                      <button 
                        onClick={() => startProcess(true)} 
                        disabled={!isDecrypting} 
                        className={`flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/20 ${!isDecrypting ? 'opacity-50' : ''}`}
                      >
                        <><Play className="w-5 h-5 mr-2" /> Decryption</>
                      </button>
                      <button 
                        onClick={() => {
                          // If switching from encrypt to decrypt and we have output, carry it over
                          if (!isDecrypting && output) {
                            setInput(output);
                          }
                          // If switching from decrypt to encrypt, reset to default message
                          else if (isDecrypting && !output) {
                            setInput("This is a secret message.");
                          }
                          setIsDecrypting(!isDecrypting);
                          resetVisualization();
                        }} 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium p-3 rounded-lg transition-all flex items-center justify-center"
                        title={isDecrypting ? "Switch to Encryption" : "Switch to Decryption"}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => resetVisualization()} 
                        title="Reset" 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium p-3 rounded-lg transition-all"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Output Section - moved here from the end */}
                  <div className={`mt-6 transition-opacity duration-500 ${currentStep >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="text-lg font-semibold text-cyan-600 mb-4">
                      {isDecrypting ? "Decrypted Plaintext" : "Encrypted Ciphertext"}
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      {output ? (
                        <div className="font-mono text-sm break-all">
                          {isDecrypting ? (
                            <div className="text-green-600">{output}</div>
                          ) : (
                            <div className="text-blue-600">{output}</div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center italic">
                          {isDecrypting 
                            ? "Decrypted message will appear here..." 
                            : "Encrypted ciphertext will appear here..."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-2xl border">
                  <h2 className="text-2xl font-bold mb-6 text-green-600 flex items-center">
                    <Unlock className="w-6 h-6 mr-3" />
                    Visualization & Output
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600 mb-3">State Matrix</h3>
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                            {formatMatrixForDisplay(matrix).map((row, i) => row.map((val, j) => {
                              const index = i * 4 + j;
                              let bgColor = "bg-gray-200";
                              if (index < 4) bgColor = "bg-purple-200"; // Constants
                              else if (index < 12) bgColor = "bg-yellow-200"; // Key
                              else if (index < 14) bgColor = "bg-blue-200"; // Nonce
                              else bgColor = "bg-green-200"; // Counter
                              return (
                                <div 
                                  key={`${i}-${j}`} 
                                  className={`p-2.5 rounded transition-colors duration-200 ${bgColor} text-gray-800`}
                                >
                                  {(val || 0).toString(16).padStart(8, "0")}
                                </div>
                              );
                            }))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-orange-600 mb-3">Algorithm Steps (Click to Navigate)</h3>
                        <div className="space-y-2">
                          {steps.map((step, index) => (
                            <div 
                              key={index} 
                              onClick={() => navigateToStep(index)}
                              className={`p-3 rounded-lg border-l-4 transition-all duration-300 text-sm cursor-pointer hover:shadow-md ${currentStep >= index ? "bg-gray-100 border-purple-400 text-gray-900" : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"} ${currentStep === index ? "scale-105 shadow-lg shadow-purple-500/10 ring-2 ring-purple-200" : ""}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0 ${currentStep >= index ? "bg-purple-600 text-white" : "bg-gray-400 text-white"}`}>
                                    {index + 1}
                                  </div>
                                  <span>{step}</span>
                                </div>
                                {currentStep === index && (
                                  <div className="ml-3 w-3 h-3 bg-green-400 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Mixing Round Navigation - shown only when in step 1 */}
                        {currentStep === 1 && stepData.mixingStates.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-md font-semibold text-blue-600 mb-3">Mixing Rounds (Click to Navigate)</h4>
                            <div className="grid grid-cols-5 gap-1 text-xs">
                              {stepData.mixingStates.map((_, index) => {
                                let roundLabel;
                                let roundType;
                                if (index === 0) {
                                  roundLabel = "Initial";
                                  roundType = "initial";
                                } else if (index % 2 === 1) {
                                  roundLabel = `C${Math.ceil(index / 2)}`;
                                  roundType = "column";
                                } else {
                                  roundLabel = `D${index / 2}`;
                                  roundType = "diagonal";
                                }
                                
                                return (
                                  <button
                                    key={index}
                                    onClick={() => navigateToMixingRound(index)}
                                    className={`p-2 rounded text-xs font-medium transition-all ${
                                      currentMixingRound === index
                                        ? "bg-purple-600 text-white shadow-md"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                    title={`${roundType === 'initial' ? 'Initial State' : roundType === 'column' ? 'Column Round' : 'Diagonal Round'} ${roundType !== 'initial' ? Math.ceil(index / 2) : ''}`}
                                  >
                                    {roundLabel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <CoreMixingVisualizer 
                      currentStep={currentStep} 
                      roundType={roundType} 
                      currentRoundNum={currentRoundNum} 
                      highlightedIndices={highlightedIndices} 
                    />
                    <AdditionVisualizer 
                      currentStep={currentStep} 
                      mixedState={mixedStateForViz} 
                      initialState={initialStateForViz} 
                      resultState={matrix} 
                    />
                    <KeystreamVisualizer 
                      currentStep={currentStep} 
                      keystreamBytes={keystreamBytesForViz} 
                    />
                    <XorVisualizer 
                      currentStep={currentStep} 
                      keystreamBytes={keystreamBytesForViz} 
                                            plaintextBytes={plaintextBytesForViz}
                      ciphertextBytes={ciphertextBytesForViz}
                      isDecrypting={isDecrypting}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
          {activeTab === "theory" && <TheoryTab />}
          {activeTab === "example" && <ExampleTab />}
        </main>
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>An interactive visualization of the Salsa20 stream cipher algorithm</p>
          <p className="mt-2">Based on the original Salsa20 specification by Daniel J. Bernstein</p>
        </footer>
      </div>
    </div>
  );
};

export default Salsa20Interactive;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
const historyImg = require('./assets/historyIcon.png');

const CalculatorApp = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const clearInput = () => {
    setInput('');
    setResult('');
  };
  const backspace = () => {
    const { start } = cursorPosition;
    if (start > 0) {
      const newInput = input.slice(0, start - 1) + input.slice(start);
      setInput(newInput);
      setCursorPosition({ start: start - 1, end: start - 1 });
    }
  };
  const handlePress = (value) => {
    if (value === '=') {
      calculateResult();
    } else if (value === 'C') {
      clearInput();
    } else if (value === 'DEL') {
      backspace();
    } else {
      insertAtCursor(value);
    }
  };
  const insertAtCursor = (value) => {
    const { start } = cursorPosition;
    const newInput = input.slice(0, start) + value + input.slice(start);
    setInput(newInput);
    const newCursorPosition = start + value.length;
    setCursorPosition({ start: newCursorPosition, end: newCursorPosition });
  };
  const calculateResult = () => {
    try {
      const newResult = parseAndCalculate(input);
      setResult(newResult.toString());
      setHistory([...history, `${input} = ${newResult}`]);
    } catch (error) {
      setResult('Error');
    }
  };
  const parseAndCalculate = (index) => {
    const tokens = index.match(/(\d+|\+|\-|\*|\/)/g);
    if (!tokens) {
      throw new Error('Invalid Expression');
    }
    let total = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const nextNumber = parseFloat(tokens[i + 1]);
      switch (operator) {
        case '+':
          total += nextNumber;
          break;
        case '-':
          total -= nextNumber;
          break;
        case '*':
          total *= nextNumber;
          break;
        case '/':
          if (nextNumber === 0) {
            throw new Error('Division by zero');
          }
          total /= nextNumber;
          break;
        default:
          throw new Error('Invalid operator');
      }
    }
    return total;
  };
  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.historyIconContainer} onPress={() => setShowHistory(!showHistory)}>
        <Image
          source={historyImg}
          style={styles.historyIcon}
        />
      </TouchableOpacity>
      {/* Display the history modal or a section */}
      {showHistory && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Calculation History</Text>
          {history.length > 0 ? (
            history.map((entry, index) => (
              <Text key={index} style={styles.historyText}>{entry}</Text>
            ))
          ) : (
            <Text style={styles.historyText}>No history yet</Text>
          )}
        </View>
      )}

      <View style={styles.displayContainer}>
        <TextInput
          style={styles.displayText}
          value={input}
          onSelectionChange={(event) =>
            setCursorPosition({
              start: event.nativeEvent.selection.start,
              end: event.nativeEvent.selection.end,
            })
          }
          selection={cursorPosition} // Set cursor position
        />
        <Text style={styles.resultText}>{result}</Text>
      </View>
      <View style={styles.row}>
        {['/', '.', '()', 'DEL'].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.button, value === 'DEL' && styles.selected]}
            onPress={() => handlePress(value)}
          >
            <Text style={styles.buttonText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {['*', '7', '8', '9'].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.button, value === '7' && styles.num, value === '8' && styles.num, value === '9' && styles.num]}
            onPress={() => handlePress(value)}
          >
            <Text style={styles.buttonText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {['-', '4', '5', '6'].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.button, value === '4' && styles.num, value === '5' && styles.num, value === '6' && styles.num]}
            onPress={() => handlePress(value)}
          >
            <Text style={styles.buttonText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {['+', '1', '2', '3'].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.button, value === '1' && styles.num, value === '2' && styles.num, value === '3' && styles.num]}
            onPress={() => handlePress(value)}
          >
            <Text style={styles.buttonText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {['C', '0', '='].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.button, value === 'C' && styles.selected, value === '=' && styles.equalbtn, value === '0' && styles.num]}
            onPress={() => handlePress(value)}
          >
            <Text style={[styles.buttonText, value === '=' && styles.equalbtnTxt]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  historyIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  historyIcon: {
    flex: 1,
    width: 25,
    height: 25,
  },
  historyContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    backgroundColor: 'rgba(14, 36, 50, 1)',
    padding: 15,
    borderRadius: 10,
    width: 200,
    zIndex: 1,
  },
  historyTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  historyText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  displayContainer: {
    width: '100%',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
  },
  displayText: {
    fontSize: 40,
    color: '#fff',
  },
  resultText: {
    textAlign: 'right',
    fontSize: 30,
    color: '#0E2432',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'rgba(300, 300, 300, 0.1)',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2.5,
    borderRadius: 20,
  },
  selected: {
    backgroundColor: 'rgba(14, 36, 50, 1)',
  },
  num: {
    backgroundColor: 'rgba(300, 300, 300, 0.3)',
  },
  equalbtn: {
    padding: 0,
    flex: 4,
    backgroundColor: '#fff',
    color: 'black',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 25,
    color: '#fff',
  },
  equalbtnTxt: {
    fontSize: 50,
    color: '#0E2432',
  },
});

export default CalculatorApp;

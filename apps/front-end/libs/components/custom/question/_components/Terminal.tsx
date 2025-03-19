import { useEffect, useRef } from "react";
import { Box, Text } from "@mantine/core";

interface ITerminal {
  output: string[];
}

export function Terminal({ output }: ITerminal) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const renderTerminalLine = (line: string, index: number) => {
    if (line.includes("✓") || line.includes("passed")) {
      return (
        <Text key={index} className="terminal-line terminal-success">
          {line}
        </Text>
      );
    } else if (line.includes("✗") || line.includes("failed") || line.includes("error")) {
      return (
        <Text key={index} className="terminal-line terminal-error">
          {line}
        </Text>
      );
    } else if (line.startsWith("$")) {
      return (
        <Text key={index} className="terminal-line">
          <span className="terminal-prompt">{line.substring(0, 1)}</span>
          {line.substring(1)}
        </Text>
      );
    } else if (line.includes("Example") || line.includes("=>")) {
      return (
        <Text key={index} className="terminal-line terminal-info">
          {line}
        </Text>
      );
    } else {
      return (
        <Text key={index} className="terminal-line">
          {line}
        </Text>
      );
    }
  };

  return (
    <Box>
      Output
      <Box
        h='180px'
        className="terminal"
        ref={terminalRef}
        style={{
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          borderRadius: '0 0 4px 4px',
          fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
          fontSize: '14px'
        }}
      >
        {output.length > 0 ? (
          output.map((line, index) => renderTerminalLine(line, index))
        ) : (
          <Text className="terminal-line">
            <span className="terminal-prompt">$</span> Run your code to see the output here...
          </Text>
        )}
      </Box>
    </Box>
  );
}
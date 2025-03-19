import { useEffect, useRef } from "react";
import { Box, Text } from "@mantine/core";
import styles from "./terminal.module.css";
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
        <Text key={index} className={`${styles.terminalLine} ${styles.terminalSuccess}`}>
          {line}
        </Text>
      );
    } else if (line.includes("✗") || line.includes("failed") || line.includes("error")) {
      return (
        <Text key={index} className={`${styles.terminalLine} ${styles.terminalError}`}>
          {line}
        </Text>
      );
    } else if (line.startsWith("$")) {
      return (
        <Text key={index} className={styles.terminalLine}>
          <span className={styles.terminalPrompt}>{line.substring(0, 1)}</span>
          {line.substring(1)}
        </Text>
      );
    } else if (line.includes("Example") || line.includes("=>")) {
      return (
        <Text key={index} className={`${styles.terminalLine} ${styles.terminalInfo}`}>
          {line}
        </Text>
      );
    } else {
      return (
        <Text key={index} className={styles.terminalLine}>
          {line}
        </Text>
      );
    }
  };

  console.log('renderTerminalLine', renderTerminalLine);

  return (
    <Box>
      Output
      <Box ref={terminalRef} className={styles.terminal}>
        {output.length > 0 ? (
          output.map((line, index) => renderTerminalLine(line, index))
        ) : (
          <Text className={styles.terminalLine}>
            <span className={styles.terminalPrompt}>$</span> Run your code to see the output here...
          </Text>
        )}
      </Box>
    </Box>
  );
}

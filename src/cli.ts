#!/usr/bin/env node

import { Command } from 'commander';
import { toDarkModeColor } from './utils/toDarkModeColor.js';
import { toFilterColor } from './utils/toFilterColor.js';

// HSL 변환 함수들 (verbose 모드용)
function hexToHsl(hex: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (hex.startsWith("#")) hex = hex.slice(1);
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

const program = new Command();

program
  .command('toDark <colors...>')
  .description('Convert hex colors to dark mode equivalent colors.')
  .option('-v, --verbose', 'Show detailed conversion information')
  .action((colors: string[], options) => {
    colors.forEach((color, index) => {
      try {
        if (options.verbose && index > 0) console.log('---');
        
        const darkModeColor = toDarkModeColor(color);
        
        if (options.verbose) {
          console.log(`Original: #${color}`);
          console.log(`Dark Mode: #${darkModeColor}`);
          
          // HSL 값도 표시
          const [h1, s1, l1] = hexToHsl(color);
          const [h2, s2, l2] = hexToHsl(darkModeColor);
          console.log(`HSL: ${h1.toFixed(0)}°, ${s1.toFixed(1)}%, ${l1.toFixed(1)}% → ${h2.toFixed(0)}°, ${s2.toFixed(1)}%, ${l2.toFixed(1)}%`);
        } else {
          console.log(`#${darkModeColor}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error processing color "${color}": ${message}`);
      }
    });
  });

program
  .command('toFilter <colors...>')
  .description('Calculate the CSS filter to match given hex colors.')
  .action((colors: string[]) => {
    colors.forEach((color, index) => {
      try {
        if (index > 0) console.log('---'); // Add a separator
        console.log(`Input Color: #${color}`);
        const { filter, loss } = toFilterColor(color);
        console.log(`Filter: ${filter}`);
        console.log(`Loss: ${loss.toFixed(2)}`);
        if (loss > 10) {
          console.warn('Warning: The color is somewhat off. The result may not be perfect.');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error processing color "${color}": ${message}`);
      }
    });
  });

program
  .command('toDarkFilter <colors...>')
  .description('Pipeline to convert a color to dark mode and then to a CSS filter.')
  .action((colors: string[]) => {
    colors.forEach((color, index) => {
      try {
        if (index > 0) console.log('---'); // Add a separator
        console.log(`Input Color: #${color}`);

        // Calculate filter for original color (Light Filter)
        const { filter: lightFilter, loss: lightLoss } = toFilterColor(color);
        console.log(`Light Filter: ${lightFilter}`);
        console.log(`Light Filter Loss: ${lightLoss.toFixed(2)}`);
        if (lightLoss > 10) {
          console.warn('Warning (Light Filter): The color is somewhat off. The result may not be perfect.');
        }

        // Convert to dark mode
        const darkModeColor = toDarkModeColor(color);
        console.log(`Dark Mode Color: #${darkModeColor}`);

        // Calculate filter for dark mode color (Dark Filter)
        const { filter: darkFilter, loss: darkLoss } = toFilterColor(darkModeColor);
        console.log(`Dark Filter: ${darkFilter}`);
        console.log(`Dark Filter Loss: ${darkLoss.toFixed(2)}`);
        if (darkLoss > 10) {
          console.warn('Warning (Dark Filter): The color is somewhat off. The result may not be perfect.');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error processing color "${color}": ${message}`);
      }
    });
  });

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}

#!/usr/bin/env node

import { Command } from 'commander';
import { toDarkModeColor } from './utils/toDarkModeColor.js';
import { toFilterColor } from './utils/toFilterColor.js';

const program = new Command();

program
  .command('toDark <colors...>')
  .description('Convert hex colors to dark mode equivalent colors.')
  .action((colors: string[]) => {
    colors.forEach(color => {
      try {
        const darkModeColor = toDarkModeColor(color);
        console.log(`#${darkModeColor}`);
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
        
        // 1. Convert to dark mode
        const darkModeColor = toDarkModeColor(color);
        console.log(`Dark Mode Color: #${darkModeColor}`);

        // 2. Convert dark mode color to filter
        const { filter, loss } = toFilterColor(darkModeColor); // Remove # from hex
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

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}

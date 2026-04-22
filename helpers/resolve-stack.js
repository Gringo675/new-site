import fs from 'fs';
import path from 'path';
import { SourceMapConsumer } from 'source-map';

// Configuration
const MAP_DIR = path.join(process.cwd(), '.output/public/_nuxt');

async function resolvePosition(fileName, line, column) {
  const mapPath = path.join(MAP_DIR, `${fileName}.map`);
  
  if (!fs.existsSync(mapPath)) {
    return { error: `Source map not found: ${mapPath}` };
  }

  try {
    const rawSourceMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    return await SourceMapConsumer.with(rawSourceMap, null, consumer => {
      const pos = consumer.originalPositionFor({
        line: line,
        column: column
      });
      return pos;
    });
  } catch (err) {
    return { error: `Failed to parse map: ${err.message}` };
  }
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.log('Usage: node scripts/resolve-stack.js "stack_trace_here"');
    process.exit(1);
  }

  // Regex to match typical stack trace lines: "at name (url:line:col)" or "at url:line:col"
  const stackRegex = /at\s+(?:[\w\s$.()]+)?\s*\(?([^)]+):(\d+):(\d+)\)?/g;
  let match;

  while ((match = stackRegex.exec(input)) !== null) {
    const [fullMatch, url, line, col] = match;
    
    // Extract just the filename from the URL (e.g., https://.../_nuxt/HusqnVxZ.js -> HusqnVxZ.js)
    const fileName = url.split('/').pop();
    
    console.log(`
Processing: ${fullMatch}`);
    const resolved = await resolvePosition(fileName, parseInt(line), parseInt(col));
    
    if (resolved.error) {
      console.log(`  ❌ ${resolved.error}`);
    } else if (resolved.source) {
      console.log(`  ✅ Original Source: ${resolved.source}`);
      console.log(`     Line: ${resolved.line}, Column: ${resolved.column}`);
      console.log(`     Name: ${resolved.name || 'N/A'}`);
    } else {
      console.log(`  ⚠️ Could not map this position.`);
    }
  }

  if (!input.match(stackRegex)) {
    console.log('No valid stack trace lines found in input.');
  }
}

main().catch(console.error);

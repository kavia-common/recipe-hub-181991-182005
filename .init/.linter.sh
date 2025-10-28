#!/bin/bash
cd /home/kavia/workspace/code-generation/recipe-hub-181991-182005/recipe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


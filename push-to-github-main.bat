@echo off
echo Checking Git status...
git status

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Push all project files"

echo Pushing to GitHub main branch...
git push -u origin main

echo Done!
pause

#!/bin/bash
# This script will automatically perform git commit based on user provided description
# to run from terminal: 
# sudo ln -s /home/ali/Documents/git_commit.sh /usr/local/bin/git_commit && chmod +x /home/ali/Documents/git_commit.sh

if [[ `git status --porcelain` ]]; then
  git status
  git add .  
  read -p "Commit description: " desc  
  git commit -m "$desc"  
  git push origin master
else
  echo -e "Nothing to commit, exiting now!"
  exit 0
fi  


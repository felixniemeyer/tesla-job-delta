npm run build && ( echo 'copying to server' ; rsync -av --delete dist/ felix@139.162.184.89:/home/felix/tools/tesla-job-delta/ )

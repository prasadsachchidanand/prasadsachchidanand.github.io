# For making same files in different folders

`for dir in *; do [ -d "$dir" ] && cp /path/file.txt "$dir" ; done`

Just replace /path/file.txt with appropriate thing. 

Taken from [here](https://askubuntu.com/questions/432795/how-to-copy-a-file-to-multiple-folders-using-the-command-line).

# For making same files in different folders

`for dir in *; do [ -d "$dir" ] && cp /path/file.txt "$dir" ; done`

`for dir in *; do [ -d "$dir" ] && cp index.html "$dir" ; done`

Just replace /path/file.txt with appropriate thing. 

Taken from [here](https://askubuntu.com/questions/432795/how-to-copy-a-file-to-multiple-folders-using-the-command-line).

# For replacing a particular text from many files

find 2023-* -name '*.html' -exec sed -i '' 's@<a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="../../../research/"> Research </a>@<a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="../../../research/"> Research </a>\n\t\t\t\t\t\t<a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="../../../teaching/"> Teaching </a>>@g' {} +
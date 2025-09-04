export const commands = {
    python: function(code:string, input:string){
        const runCommand = `echo '${code}' > code.py && echo '${input}' > input.txt && python3 code.py < input.txt `;
        return ['/bin/bash','-c', runCommand];
    },
    cpp:function(code:string, input:string){
        const runCommand = `mkdir app && cd app && echo '${code}' > cppcode.cpp && echo '${input}' > input.txt && g++ cppcode.cpp -o run && ./run < input.txt`;
        return ['/bin/bash','-c', runCommand];
    }
}

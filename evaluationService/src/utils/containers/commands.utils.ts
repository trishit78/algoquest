export const commands = {
    python: function(code:string){
        const runCommand = `echo '${code}' > code.py && python3 code.py`;
        return ['/bin/bash','-c', runCommand];
    },
    cpp:function(code:string){
        const runCommand = `mkdir app && cd app && echo '${code}'  > cppcode.cpp && g++ cppcode.cpp -o run && ./run`;
        return ['/bin/bash','-c', runCommand];
    }
}
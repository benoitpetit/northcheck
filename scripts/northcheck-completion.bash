# northcheck-completion.bash

_northcheck_completion() {
    local cur prev opts cmd
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    cmd="${COMP_WORDS[0]}"

    case "${cmd}" in
        nc|northcheck)
            case "${COMP_CWORD}" in
                1) # Completing the subcommand (file, link)
                    opts="file link"
                    COMPREPLY=( $(compgen -W "${opts}" -- "${cur}") )
                    ;;
                2) # Completing the argument for 'file' or 'link'
                    case "${prev}" in
                        file)
                            COMPREPLY=( $(compgen -f "${cur}") ) # Files
                            ;;
                        link)
                            # No specific completion for URLs, maybe just default bash completion
                            ;;
                    esac
                    ;;
            esac
            ;;
    esac
}

complete -F _northcheck_completion nc northcheck

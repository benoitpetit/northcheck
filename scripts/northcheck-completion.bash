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
                1) # Completing the subcommand (file, link, hash)
                    opts="file link hash"
                    COMPREPLY=( $(compgen -W "${opts}" -- "${cur}") )
                    ;;
                2) # Completing the argument for 'file', 'link', or 'hash'
                    case "${prev}" in
                        file)
                            COMPREPLY=( $(compgen -f "${cur}") ) # Files
                            ;;
                        link)
                            # No specific completion for URLs, maybe just default bash completion
                            ;;
                        hash)
                            # No specific completion for hashes
                            ;;
                    esac
                    ;;
                3) # Completing options for 'file' command
                    if [[ "${COMP_WORDS[1]}" == "file" ]]; then
                        opts="--json --hash --size --name"
                        COMPREPLY=( $(compgen -W "${opts}" -- "${cur}") )
                    fi
                    ;;
                4) # Completing options for 'hash' command
                    if [[ "${COMP_WORDS[1]}" == "hash" ]]; then
                        opts="--json --size --name"
                        COMPREPLY=( $(compgen -W "${opts}" -- "${cur}") )
                    fi
                    ;;
            esac
            ;;
    esac
}

complete -F _northcheck_completion nc northcheck

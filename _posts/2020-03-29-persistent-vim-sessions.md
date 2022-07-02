---
layout: post
title: Persistent Vim sessions
tags: [vim]
---

I just learned that you can persist the history between Vim sessions. This is hugely useful in my view, and it just takes two lines in your vimrc to set it up.

```
set undofile 
set undodir=~/.vim/undodir
```

The first line enables the feature. The second line tells vim to store the history files under ~/.vim/undodir. 
Without the second line, you will have the history files next to your regular files.

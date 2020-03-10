# ~ https://tangjeff0.github.io/vapor_docs/ ~

> originally packaged as a full-stack Electron app with a Mongo backend and websockets for real-time collaboration. now just a front-end for your aesthetic pleasure

# \\/ /\ P O R D O C S

wavey text editor intended for collaboration
![GIFS](gifs/GIFS.gif)

# t e c h n o l o g i e s

- real-time, collaborative editing via **SocketIO**
- client-side routing via **React Electron** + **React MemoryRouter** + **Redux**, bundled with **WebPack**
- rich text display and editing via **DraftJS** + **contentEditable**
- front-end design components, compliments of **React-Materialize**
- JSON API backend created with **Mongo**, **Express**; user login and registration managed by **PassportJS**

# f e a t u r e s

- see other users' **Cursors** and **Selections** in real-time
![teamwork](gifs/teamwork.gif)
- auto-generate **Outline** through detection of bolded, large text
![outline](gifs/outline.gif)
- rapidly navigate through documents with **Search Bar** that highlights keywords
![search](https://j.gifs.com/gLLPN9.gif)
- "never forget" with **Revision History** that manages and retrieves previous versions
![revision](gifs/revision.gif)

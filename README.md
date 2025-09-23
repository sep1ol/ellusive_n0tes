# 🔐 Ellusive Notes

Built to send private information that gets deleted once it's read by the other person.

## ✨ Features

- **🔥 Self-Destructing Notes**: Messages are automatically deleted after being read once
- **🔒 End-to-End Encryption**: All notes are encrypted using AES-256-GCM
- **💾 Zero Persistence**: Notes exist only in server memory - no database, no logs
- **🔑 Optional Password Protection**: Add an extra layer of security with password-protected notes
- **⏱️ Expiration Times**: Set notes to expire after a specified duration (1 minute to 7 days)
- **🎨 Modern UI**: Clean, dark-themed interface built with shadcn-svelte
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

- **Framework**: [SvelteKit 5](https://kit.svelte.dev/) with TypeScript
- **UI Components**: [shadcn-svelte](https://www.shadcn-svelte.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Encryption**: Node.js Crypto module (AES-256-GCM)
- **Deployment**: Node adapter for various hosting platforms

## 📖 How It Works

1. **Create a Note**: Enter your message, optionally add a password and/or expiration time
2. **Share the Link**: Copy the generated unique URL and send it to your recipient
3. **One-Time Access**: When the recipient opens the link, they can view the note once
4. **Auto-Destruction**: The note is immediately deleted from memory after being read

### Security Features

- Notes are encrypted at rest in server memory
- Unique 48-character random IDs prevent URL guessing
- No data persistence - server restart clears all notes
- Optional password protection uses scrypt for key derivation
- HTTPOnly cookies for session management (if implemented)

## 🔧 Configuration

Environment variables (`.env`):

```env
ENCRYPTION_KEY=your-super-secret-encryption-key-min-32-chars
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Repository**: [github.com/sep1ol/secret_n0te](https://github.com/sep1ol/secret_n0te)
- **Demo**: [tempnote.iasecurity.cloud](https://tempnote.iasecurity.cloud) _(if deployed)_

## ⚠️ Disclaimer

This application stores notes in server memory only. A server restart will delete all notes. This is by design for maximum security, but means notes are not persistent across server restarts or crashes.

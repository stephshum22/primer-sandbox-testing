# Primer Checkout Sandbox

A modern checkout implementation using Primer's Universal Checkout in sandbox mode.

## Features

- ✅ Primer Universal Checkout integration
- ✅ Sandbox environment for testing
- ✅ Modern React/Next.js implementation
- ✅ Responsive design
- ✅ Test card numbers included
- ✅ Webhook support for payment events

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Primer API Key

1. Sign up for a Primer account at [primer.io](https://primer.io)
2. Get your sandbox API key from the Primer Dashboard
3. Create a `.env.local` file in the root directory:

```env
PRIMER_API_KEY=your_sandbox_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the checkout page.

## Testing

Use these test card numbers in the sandbox:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `PRIMER_API_KEY` environment variable in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

## API Endpoints

- `POST /api/client-session` - Creates a Primer client session
- `POST /api/payment-status` - Fetches payment status

## Environment Variables

- `PRIMER_API_KEY` - Your Primer sandbox API key

## Next Steps

1. **Get your Primer API key** from the [Primer Dashboard](https://dashboard.primer.io)
2. **Test the integration** with the provided test cards
3. **Configure webhooks** for production payment events
4. **Customize the UI** to match your brand

## Resources

- [Primer Documentation](https://primer.io/docs)
- [Primer API Reference](https://primer.io/docs/api-reference/get-started/overview)
- [Universal Checkout Guide](https://primer.io/docs/universal-checkout/get-started/overview)

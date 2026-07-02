export const APP = {
	name: "Index",
	description:
		"A boilerplate for building SaaS applications with Next.js, Express, and PostgreSQL.",
	tagline: "Minimalist Publishing Workspace",
	domain: "index.so",
	copyright: `© ${new Date().getFullYear()} Index Inc. All rights reserved.`,
	defaultTitle: "Boilerplate SaaS",
} as const;

export const ENV = {
	get apiUrl(): string {
		return (
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
		);
	},
	get frontendUrl(): string {
		return process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
	},
	get googleClientId(): string | undefined {
		return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
	},
	get googleClientSecret(): string | undefined {
		return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
	},
	get googleOAuthRedirectUri(): string | undefined {
		return process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI;
	},
	get cloudinaryCloudName(): string | undefined {
		return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	},
	get cloudinaryUploadPreset(): string | undefined {
		return process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
	},
} as const;

export const ROUTES = {
	home: "/",
	login: "/login",
	signup: "/signup",
	forgotPassword: "/forgot-password",
	resetPassword: "/reset-password",
	verifyEmail: "/verify-email",
	onboarding: "/onboarding",
	invitations: "/invitations",
	about: "/about",
	privacy: "/privacy",

	dashboard: {
		root: "/dashboard",
		settings: {
			root: "/dashboard/settings",
			profile: "/dashboard/settings/profile",
			general: "/dashboard/settings/general",
			members: "/dashboard/settings/members",
			billing: "/dashboard/settings/billing",
			notifications: "/dashboard/settings/notifications",
		},
	},

	get protectedPrefixes(): string[] {
		return [this.dashboard.root, this.onboarding, this.invitations];
	},

	get authRoutes(): string[] {
		return [
			this.login,
			this.signup,
			this.forgotPassword,
			this.resetPassword,
		];
	},

	get publicPaths(): string[] {
		return [this.home, this.login, this.signup];
	},

	get defaultRedirectAfterLogin(): string {
		return this.dashboard.root;
	},

	get defaultRedirectAfterVerifyEmail(): string {
		return this.onboarding;
	},

	get defaultRedirectAfterSignup(): string {
		return this.onboarding;
	},

	get defaultRedirectAfterLogout(): string {
		return this.login;
	},

	get defaultRedirectAfterResetPassword(): string {
		return this.login;
	},
} as const;

export const API_ENDPOINTS = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		refresh: "/auth/refresh",
		logout: "/auth/logout",
		verifyEmail: "/auth/verify-email",
		forgotPassword: "/auth/forgot-password",
		resetPassword: "/auth/reset-password",
		me: "/auth/me",
	},
	users: {
		me: "/users/me",
		changePassword: "/users/me/change-password",
	},
	organizations: {
		root: "/organizations/",
		members: (orgId: string) => `/organizations/${orgId}/members`,
		member: (orgId: string, userId: string) =>
			`/organizations/${orgId}/members/${userId}`,
		invitations: (orgId: string) => `/organizations/${orgId}/invitations`,
		invitation: (orgId: string, invitationId: string) =>
			`/organizations/${orgId}/invitations/${invitationId}`,
		acceptInvitation: "/organizations/invitations/accept",
	},
	billing: {
		verify: "/billing/verify",
		initialize: (orgId: string) =>
			`/billing/organizations/${orgId}/initialize`,
		manage: (orgId: string) => `/billing/organizations/${orgId}/manage`,
		cancel: (orgId: string) => `/billing/organizations/${orgId}/cancel`,
	},
	mfa: {
		setup: "/mfa/setup",
		verify: "/mfa/verify",
		disable: "/mfa/disable",
		validate: "/mfa/validate",
	},
	notifications: {
		root: "/notifications/",
		markRead: (id: string) => `/notifications/${id}/read`,
		markAllRead: "/notifications/mark-all-read",
	},
	admin: {
		stats: "/admin/stats",
		users: "/admin/users",
		organizations: "/admin/organizations",
		deactivateUser: (userId: string) => `/admin/users/${userId}/deactivate`,
		activateUser: (userId: string) => `/admin/users/${userId}/activate`,
	},
	health: {
		health: "/health",
		ready: "/ready",
	},
	oauth: {
		google: "/api/v1/auth/oauth/google",
		github: "/api/v1/auth/oauth/github",
		googleCallback: "/auth/oauth/google/callback",
		githubCallback: "/auth/oauth/github/callback",
	},
} as const;

export const STORAGE_KEYS = {
	accessToken: "access_token",
	refreshToken: "refresh_token",
	activeOrganizationId: "active_organization_id",
	themeMode: "index-theme-mode",
	primaryColor: "index-primary-color",
} as const;

export const DEFAULTS = {
	primaryColor: "#4f46e5",
	themeColorLight: "#ffffff",
	themeColorDark: "#0a0a0a",
} as const;

export const QUERY_KEYS = {
	organizations: ["organizations"] as const,
	me: ["auth", "me"] as const,
	user: ["user", "me"] as const,
} as const;

export const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "Examples", href: "#case-studies" },
	{ label: "Help Center", href: "#docs" },
] as const;

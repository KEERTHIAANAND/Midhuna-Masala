'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Google Icon SVG Component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export default function SignupPage() {
    const router = useRouter();
    const { signInWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [agreeTerms, setAgreeTerms] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !authLoading) router.push('/');
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (!agreeTerms) { setError('Please agree to the Terms & Conditions'); return; }

        setIsLoading(true);
        // For now, email/password signup just shows an error since we're using Google Auth
        setError('Please use Google Sign-in to create your account.');
        setIsLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsGoogleLoading(true);

        const result = await signInWithGoogle();

        if (result.success) {
            setSuccess(true);
            setTimeout(() => router.push('/'), 1500);
        } else {
            setError(result.error || 'Failed to sign up. Please try again.');
        }
        setIsGoogleLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const getPasswordStrength = () => {
        const p = formData.password;
        if (!p) return { strength: 0, label: '', color: '' };
        let score = 0;
        if (p.length >= 6) score++;
        if (p.length >= 10) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        if (score <= 2) return { strength: score * 20, label: 'Weak', color: 'bg-red-500' };
        if (score <= 3) return { strength: score * 20, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: score * 20, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFDF5] via-[#F5E9DB] to-[#F0E4D6] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div className="absolute top-20 left-10 w-4 h-4 rounded-full bg-[#E24B3A]/20" animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
                <motion.div className="absolute bottom-32 right-16 w-5 h-5 rounded-full bg-[#F6C84C]/30" animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Signup Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md z-10">
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Back Icon - Top Right */}
                    <Link href="/" className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                        <X className="w-5 h-5" />
                    </Link>

                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-[#8B1E1E] to-[#6B1616] px-8 pt-8 pb-14">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#F6C84C 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative text-center">
                            <Link href="/"><h1 className="text-3xl font-bold text-white font-serif tracking-wide">Midhuna Masala</h1><p className="text-[10px] font-bold text-[#F6C84C] tracking-[0.25em] uppercase mt-1">Traditional Stone Ground Spices</p></Link>
                        </motion.div>
                        <div className="text-center mt-5"><h2 className="text-xl font-serif text-white/90">Join Our Family</h2><p className="text-sm text-[#F6C84C]/80 mt-1">Create your account</p></div>
                        <div className="absolute -bottom-px left-0 right-0"><svg viewBox="0 0 400 30" preserveAspectRatio="none" className="w-full h-8 text-white"><path d="M0 30 Q200 0 400 30 L400 30 L0 30 Z" fill="currentColor" /></svg></div>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-8 pt-4">
                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
                                    <h3 className="text-xl font-serif font-bold text-gray-800">Welcome to the Family!</h3>
                                    <p className="text-gray-500 mt-2">Redirecting you...</p>
                                </motion.div>
                            ) : (
                                <motion.div key="form" className="space-y-4">
                                    <AnimatePresence>{error && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-600">{error}</p></motion.div>)}</AnimatePresence>

                                    {/* Google Sign In Button */}
                                    <motion.button
                                        type="button"
                                        onClick={handleGoogleSignIn}
                                        disabled={isGoogleLoading || isLoading}
                                        whileHover={{ scale: isGoogleLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: isGoogleLoading ? 1 : 0.98 }}
                                        className={`w-full py-3.5 rounded-xl font-semibold text-gray-700 flex items-center justify-center gap-3 transition-all border-2 ${isGoogleLoading
                                                ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        {isGoogleLoading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating account...</span></>
                                        ) : (
                                            <><GoogleIcon /><span>Sign up with Google</span></>
                                        )}
                                    </motion.button>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                        <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-400">or sign up with email</span></div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'transform scale-[1.01]' : ''}`}>
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className={`h-5 w-5 transition-colors ${focusedField === 'name' ? 'text-[#8B1E1E]' : 'text-gray-400'}`} /></div>
                                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${focusedField === 'name' ? 'border-[#8B1E1E] bg-white shadow-lg shadow-[#8B1E1E]/10' : 'border-gray-200 hover:border-gray-300'}`} placeholder="Your full name" required />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.01]' : ''}`}>
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className={`h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-[#8B1E1E]' : 'text-gray-400'}`} /></div>
                                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${focusedField === 'email' ? 'border-[#8B1E1E] bg-white shadow-lg shadow-[#8B1E1E]/10' : 'border-gray-200 hover:border-gray-300'}`} placeholder="you@example.com" required />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'phone' ? 'transform scale-[1.01]' : ''}`}>
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className={`h-5 w-5 transition-colors ${focusedField === 'phone' ? 'text-[#8B1E1E]' : 'text-gray-400'}`} /></div>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${focusedField === 'phone' ? 'border-[#8B1E1E] bg-white shadow-lg shadow-[#8B1E1E]/10' : 'border-gray-200 hover:border-gray-300'}`} placeholder="+91 98765 43210" />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.01]' : ''}`}>
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className={`h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-[#8B1E1E]' : 'text-gray-400'}`} /></div>
                                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${focusedField === 'password' ? 'border-[#8B1E1E] bg-white shadow-lg shadow-[#8B1E1E]/10' : 'border-gray-200 hover:border-gray-300'}`} placeholder="Min 6 characters" required />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#8B1E1E]">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                                            </div>
                                            {formData.password && (
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${passwordStrength.strength}%` }} className={`h-full ${passwordStrength.color}`} /></div>
                                                    <span className={`text-xs font-medium ${passwordStrength.strength <= 40 ? 'text-red-500' : passwordStrength.strength <= 60 ? 'text-yellow-600' : 'text-green-600'}`}>{passwordStrength.label}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'transform scale-[1.01]' : ''}`}>
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className={`h-5 w-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-[#8B1E1E]' : 'text-gray-400'}`} /></div>
                                                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${focusedField === 'confirmPassword' ? 'border-[#8B1E1E] bg-white shadow-lg shadow-[#8B1E1E]/10' : 'border-gray-200 hover:border-gray-300'} ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300' : ''}`} placeholder="Re-enter password" required />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#8B1E1E]">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                                            </div>
                                        </div>

                                        {/* Terms */}
                                        <label className="flex items-start gap-3 cursor-pointer pt-2">
                                            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#8B1E1E] focus:ring-[#8B1E1E]" />
                                            <span className="text-sm text-gray-600">I agree to the <Link href="/terms" className="text-[#8B1E1E] hover:underline font-medium">Terms & Conditions</Link> and <Link href="/privacy" className="text-[#8B1E1E] hover:underline font-medium">Privacy Policy</Link></span>
                                        </label>

                                        <motion.button type="submit" disabled={isLoading || isGoogleLoading} whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }} className={`w-full py-4 rounded-xl font-bold text-white tracking-wide uppercase text-sm flex items-center justify-center gap-2 transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#8B1E1E] to-[#6B1616] hover:from-[#7A1A1A] hover:to-[#5A1313] shadow-lg shadow-[#8B1E1E]/30 hover:shadow-xl hover:shadow-[#8B1E1E]/40'}`}>
                                            {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Creating Account...</span></>) : (<><span>Create Account</span><ArrowRight className="w-5 h-5" /></>)}
                                        </motion.button>
                                    </form>

                                    <p className="text-center mt-4 text-xs text-gray-500">Already have an account? <Link href="/login" className="text-[#8B1E1E] font-semibold hover:underline">Sign in</Link></p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

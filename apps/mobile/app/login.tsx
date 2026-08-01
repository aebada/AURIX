import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

export default function LoginScreen() {
  const colors = useThemeColors();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, fullName);
      }
      router.replace('/');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AURIX</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        {mode === 'login' ? 'Sign in to your wallet' : 'Create your AURIX account'}
      </Text>

      {mode === 'register' && (
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.muted }]}>Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            placeholder="Jane Doe"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
        </View>
      )}

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.muted }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
      </View>

      {error && (
        <View style={[styles.errorBox, { borderColor: '#ef4444' }]}>
          <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
        </View>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={busy || !email || !password || (mode === 'register' && !fullName)}
        style={[styles.cta, { backgroundColor: colors.tint, opacity: busy ? 0.6 : 1 }]}>
        <Text style={[styles.ctaLabel, { color: colors.background }]}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setError(null);
          setMode(mode === 'login' ? 'register' : 'login');
        }}>
        <Text style={[styles.switchLabel, { color: colors.tint }]}>
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  field: { gap: 6, marginBottom: 14, backgroundColor: 'transparent' },
  label: { fontSize: 12, textTransform: 'uppercase' },
  input: {
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  cta: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaLabel: { fontSize: 15, fontWeight: '800' },
  switchLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
  },
});

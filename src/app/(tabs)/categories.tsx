import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { palette, radii, space } from '@/constants/tokens';
import { CATEGORIES } from '@/data/catalog/categories';

export default function CategoriesScreen() {
  return (
    <ScreenScroll insetTop>
      <AppText variant="hero" accessibilityRole="header">
        Categories
      </AppText>
      {CATEGORIES.map((c) => (
        <Pressable
          key={c.slug}
          onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: c.slug } })}
          accessibilityRole="button"
          accessibilityLabel={c.title}
          className="active:opacity-85"
          style={styles.card}>
          <Image source={c.image} contentFit="cover" style={styles.image} accessible={false} />
          <View style={styles.body}>
            <View style={styles.icon}>
              <Icon name={c.icon} size={22} color="brand" />
            </View>
            <View style={styles.text}>
              <AppText variant="cardTitle">{c.title}</AppText>
              <AppText variant="caption" color="textMuted">
                {c.subtitle}
              </AppText>
            </View>
          </View>
        </Pressable>
      ))}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.surface, borderRadius: radii.card, borderWidth: 1, borderColor: palette.border, overflow: 'hidden' },
  image: { height: 110, width: '100%' },
  body: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
  icon: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: palette.brandTint, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
});

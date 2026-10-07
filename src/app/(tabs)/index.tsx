import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChips, CategoryChipsSkeleton } from '@/components/home/category-chips';
import { CategoryRail, CategoryRailSkeleton } from '@/components/home/category-rail';
import { FestiveBanner, FestiveBannerSkeleton } from '@/components/home/festive-banner';
import { Header } from '@/components/home/header';
import { SearchBar } from '@/components/home/search-bar';
import { ServiceGrid, ServiceGridSkeleton } from '@/components/home/service-grid';
import { useFloatingBottomInset } from '@/components/navigation/floating-bottom-area';
import { AppText } from '@/components/ui/app-text';
import { palette, radii, sizes, space } from '@/constants/tokens';
import type { HomeFeed } from '@/data/types';
import { useHomeFeed } from '@/hooks/use-home-feed';
import { useAppState } from '@/state/app-state';

const openCategory = (slug: string) =>
  router.push({ pathname: '/category/[slug]', params: { slug } });

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = useFloatingBottomInset();
  const { address, walletBalance } = useAppState();
  const { status, feed, retry } = useHomeFeed();
  const [query, setQuery] = useState('');
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);

  const activeChipId = selectedChipId ?? feed?.chips[0]?.id ?? '';

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.statusBarFill, { height: insets.top }]} />
      <ScrollView
        stickyHeaderIndices={[1]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottomInset }}>
        <View style={styles.headerTop}>
          <View style={styles.overscrollFill} />
          <Header
            address={address}
            walletBalance={walletBalance}
            onLocationPress={() => router.push('/address')}
            onWalletPress={() => router.push('/wallet')}
            onProfilePress={() => router.push('/profile')}
          />
        </View>

        <View style={styles.searchWrap}>
          <SearchBar
            hints={feed?.searchHints ?? []}
            value={query}
            onChangeText={setQuery}
            onSubmit={(q) => router.push({ pathname: '/search', params: { q } })}
            onVoicePress={() => router.push({ pathname: '/search', params: { voice: '1' } })}
          />
        </View>

        <View style={styles.chipsWrap}>
          {feed ? (
            <CategoryChips
              chips={feed.chips}
              selectedId={activeChipId}
              onSelect={(chip) => setSelectedChipId(chip.id)}
            />
          ) : (
            <CategoryChipsSkeleton />
          )}
        </View>

        <View style={styles.body}>
          {status === 'ready' ? <HomeSections feed={feed} /> : null}
          {status === 'loading' ? <HomeSkeleton /> : null}
          {status === 'error' ? <HomeError onRetry={retry} /> : null}
        </View>
      </ScrollView>
    </View>
  );
}

function HomeSections({ feed }: { feed: HomeFeed }) {
  return (
    <>
      {feed.banner ? (
        <FestiveBanner banner={feed.banner} onPress={(b) => openCategory(b.target)} />
      ) : null}
      <ServiceGrid
        title="What do you need today?"
        services={feed.services}
        onSelect={(s) => openCategory(s.id)}
      />
      {feed.rails.map((rail) => (
        <CategoryRail
          key={rail.id}
          rail={rail}
          onSeeAll={(r) => openCategory(r.id)}
          onSelectProduct={(p) => router.push({ pathname: '/product/[id]', params: { id: p.id } })}
        />
      ))}
    </>
  );
}

function HomeSkeleton() {
  return (
    <View
      style={styles.skeleton}
      accessible
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}>
      <FestiveBannerSkeleton />
      <ServiceGridSkeleton />
      <CategoryRailSkeleton />
      <CategoryRailSkeleton />
    </View>
  );
}

function HomeError({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.error}>
      <AppText variant="body" color="textMuted">
        Couldn&apos;t load shops near you.
      </AppText>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        style={({ pressed }) => [styles.retry, pressed && { opacity: 0.7 }]}>
        <AppText variant="button" color="onBrand">
          Try again
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  statusBarFill: {
    backgroundColor: palette.brand,
  },
  overscrollFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '100%',
    height: 1000,
    backgroundColor: palette.brand,
  },
  headerTop: {
    backgroundColor: palette.brand,
    paddingTop: space.xl,
    paddingHorizontal: space.gutter,
    paddingBottom: space.sm,
  },
  searchWrap: {
    backgroundColor: palette.brand,
    paddingHorizontal: space.gutter,
    paddingTop: space.headerGap - space.sm,
    paddingBottom: space.headerGap,
  },
  chipsWrap: {
    backgroundColor: palette.brand,
  },
  body: {
    paddingHorizontal: space.gutter,
    paddingTop: space.xl,
    gap: space.section,
  },
  skeleton: {
    gap: space.section,
  },
  error: {
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.section,
  },
  retry: {
    minHeight: sizes.touch,
    paddingHorizontal: space.xl,
    borderRadius: radii.full,
    backgroundColor: palette.brand,
    justifyContent: 'center',
  },
});

import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { navTabs } from '@/components/navigation/bottom-nav';
import { FloatingBottomAreaProvider } from '@/components/navigation/floating-bottom-area';

export default function TabsLayout() {
  return (
    <Tabs style={styles.fill}>
      <FloatingBottomAreaProvider>
        <TabSlot style={styles.fill} />
      </FloatingBottomAreaProvider>
      {/* Route registry only; the visible bar is <BottomNav> inside the floating area. */}
      <TabList style={styles.hidden}>
        {navTabs.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} />
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});

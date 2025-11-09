import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { walletsAPI, Wallet } from '../api/api';

export const WalletsScreen = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  const loadWallets = async () => {
    try {
      setLoading(true);
      const data = await walletsAPI.list();
      setWallets(data);
    } catch (error: any) {
      Alert.alert('Error', 'Kunde inte ladda plånböcker');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWallets();
  }, []);

  const handleCreateWallet = () => {
    Alert.prompt(
      'Ny plånbok',
      'Ange namn på plånboken',
      async (name) => {
        if (name) {
          try {
            await walletsAPI.create(name, 'SEK');
            loadWallets();
          } catch (error) {
            Alert.alert('Error', 'Kunde inte skapa plånbok');
          }
        }
      }
    );
  };

  const handleWalletPress = async (wallet: Wallet) => {
    try {
      const fullWallet = await walletsAPI.get(wallet.id);
      const transactions = await walletsAPI.getTransactions(wallet.id);
      
      Alert.alert(
        fullWallet.name,
        `Saldo: ${fullWallet.balance || 0} ${fullWallet.currency}\n\nTransaktioner: ${transactions.length}`,
        [
          { text: 'Stäng', style: 'cancel' },
          {
            text: 'Lägg till transaktion',
            onPress: () => handleAddTransaction(wallet.id),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Kunde inte ladda plånboksdetaljer');
    }
  };

  const handleAddTransaction = (walletId: number) => {
    Alert.alert(
      'Ny transaktion',
      'Välj typ',
      [
        {
          text: 'Inkomst',
          onPress: () => promptAmount(walletId, 'credit'),
        },
        {
          text: 'Utgift',
          onPress: () => promptAmount(walletId, 'debit'),
        },
        { text: 'Avbryt', style: 'cancel' },
      ]
    );
  };

  const promptAmount = (walletId: number, type: 'credit' | 'debit') => {
    Alert.prompt(
      'Belopp',
      `Ange belopp för ${type === 'credit' ? 'inkomst' : 'utgift'}`,
      async (text) => {
        const amount = parseFloat(text || '0');
        if (amount > 0) {
          try {
            await walletsAPI.createTransaction(walletId, amount, type);
            loadWallets();
            Alert.alert('Klart!', 'Transaktion tillagd');
          } catch (error) {
            Alert.alert('Error', 'Kunde inte lägga till transaktion');
          }
        }
      },
      'plain-text',
      '',
      'numeric'
    );
  };

  const renderWallet = ({ item }: { item: Wallet }) => (
    <TouchableOpacity
      style={styles.walletCard}
      onPress={() => handleWalletPress(item)}
    >
      <View>
        <Text style={styles.walletName}>{item.name}</Text>
        <Text style={styles.walletCurrency}>{item.currency}</Text>
      </View>
      {item.balance !== undefined && (
        <Text style={styles.walletBalance}>
          {item.balance} {item.currency}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mina Plånböcker</Text>
        <Text style={styles.headerSubtitle}>Välkommen, {user?.username}!</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logga ut</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wallets}
        renderItem={renderWallet}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Laddar...' : 'Inga plånböcker ännu'}
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleCreateWallet}
      >
        <Text style={styles.addButtonText}>+ Skapa ny plånbok</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#0f3460',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16c79a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  list: {
    padding: 20,
  },
  walletCard: {
    backgroundColor: '#0f3460',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletCurrency: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16c79a',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#16c79a',
    margin: 20,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

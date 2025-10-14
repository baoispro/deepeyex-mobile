import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetAllDrugsQuery } from '../../hospital/hooks/queries/drugs/use-get-list-drug.query';
import { Drug } from '../../hospital/types/drug';
import { useCart } from '../../../shared/hooks/useCart';

const MedicineListScreen = () => {
  const [selectedMedicine, setSelectedMedicine] = useState<Drug | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();
  const { totalItems, addToCart } = useCart();

  // Sử dụng hook để lấy dữ liệu thuốc từ API
  const { data: drugsResponse, isLoading, error } = useGetAllDrugsQuery();

  // Lấy danh sách thuốc từ response
  const medicines = drugsResponse?.data || [];

  const handleAddToCart = (drug: Drug) => {
    if (drug.stock_quantity <= 0) {
      Alert.alert('Hết hàng', 'Sản phẩm này hiện đã hết hàng');
      return;
    }
    addToCart(drug, quantity);
    Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng', [
      { text: 'Tiếp tục mua', style: 'cancel' },
      {
        text: 'Xem giỏ hàng',
        onPress: () => navigation.navigate('Cart' as never),
      },
    ]);
    setQuantity(1); // Reset quantity về 1 sau khi thêm vào giỏ
  };

  const Colors = {
    primaryBlue: '#3366FF',
    backgroundWhite: '#fff',
    textDark: '#333',
    textGray: '#666',
  };
  const renderHeader = (title: string, onBack?: () => void) => (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Cart' as never)}
        style={styles.cartButton}
      >
        <Ionicons name="cart-outline" size={24} color={Colors.primaryBlue} />
        {totalItems > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  // Hiển thị loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {renderHeader('Danh sách thuốc')}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={styles.loadingText}>Đang tải danh sách thuốc...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {renderHeader('Danh sách thuốc')}
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>Không thể tải danh sách thuốc</Text>
          <Text style={styles.errorSubText}>Vui lòng thử lại sau</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedMedicine) {
    const discountedPrice =
      selectedMedicine.price * (1 - selectedMedicine.discount_percent / 100);
    const totalPrice = discountedPrice * quantity;

    // Chi tiết thuốc - Giao diện mới
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {renderHeader('Chi tiết thuốc', () => setSelectedMedicine(null))}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  selectedMedicine.image ||
                  'https://cdn-icons-png.flaticon.com/512/2533/2533459.png',
              }}
              style={styles.medicineImage}
            />
            {selectedMedicine.discount_percent > 0 && (
              <View style={styles.discountBadgeLarge}>
                <Text style={styles.discountBadgeLargeText}>
                  -{selectedMedicine.discount_percent}%
                </Text>
              </View>
            )}
          </View>

          {/* Product Info Section */}
          <View style={styles.detailContentContainer}>
            {/* Product Name */}
            <Text style={styles.detailMedicineName}>
              {selectedMedicine.name}
            </Text>

            {/* Stock Status */}
            <View
              style={[
                styles.stockBadge,
                selectedMedicine.stock_quantity <= 0 && styles.outOfStockBadge,
              ]}
            >
              <Ionicons
                name={
                  selectedMedicine.stock_quantity > 0
                    ? 'checkmark-circle'
                    : 'close-circle'
                }
                size={16}
                color={
                  selectedMedicine.stock_quantity > 0 ? '#28a745' : '#dc3545'
                }
              />
              <Text
                style={[
                  styles.stockBadgeText,
                  selectedMedicine.stock_quantity <= 0 &&
                    styles.outOfStockBadgeText,
                ]}
              >
                {selectedMedicine.stock_quantity > 0
                  ? `Còn ${selectedMedicine.stock_quantity} sản phẩm`
                  : 'Hết hàng'}
              </Text>
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.detailPriceLabel}>Giá bán:</Text>
                <View style={styles.priceGroup}>
                  <Text style={styles.detailPrice}>
                    {discountedPrice.toLocaleString('vi-VN')}đ
                  </Text>
                  {selectedMedicine.discount_percent > 0 && (
                    <Text style={styles.detailOriginalPrice}>
                      {selectedMedicine.price.toLocaleString('vi-VN')}đ
                    </Text>
                  )}
                </View>
              </View>
              <View>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={Colors.primaryBlue}
                  />
                  <View>
                    <Text style={styles.sectionTitle}>Mô tả sản phẩm: </Text>
                    <Text style={styles.detailDescription}>
                      {selectedMedicine.description ||
                        'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.quantityCardLabel}>Số lượng</Text>
                <View style={styles.quantityControlsNew}>
                  <TouchableOpacity
                    style={styles.quantityButtonNew}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Ionicons
                      name="remove"
                      size={22}
                      color={Colors.primaryBlue}
                    />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplayNew}>
                    <Text style={styles.quantityValueNew}>{quantity}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.quantityButtonNew}
                    onPress={() =>
                      setQuantity(
                        Math.min(selectedMedicine.stock_quantity, quantity + 1),
                      )
                    }
                  >
                    <Ionicons name="add" size={22} color={Colors.primaryBlue} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Cart Button */}
        <View style={styles.bottomCartContainer}>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceLabel}>Tổng cộng</Text>
            <Text style={styles.totalPriceValue}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.addToCartButtonNew,
              selectedMedicine.stock_quantity <= 0 && styles.disabledButton,
            ]}
            onPress={() => handleAddToCart(selectedMedicine)}
            disabled={selectedMedicine.stock_quantity <= 0}
          >
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={styles.addToCartButtonText}>
              {selectedMedicine.stock_quantity <= 0
                ? 'Hết hàng'
                : 'Thêm vào giỏ hàng'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Danh sách thuốc - Giao diện mới
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {renderHeader('Danh sách thuốc')}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical" size={80} color="#ddd" />
            <Text style={styles.emptyText}>Không có thuốc nào</Text>
            <Text style={styles.emptySubText}>Vui lòng quay lại sau</Text>
          </View>
        ) : (
          medicines.map(med => {
            const discountedPrice =
              med.price * (1 - med.discount_percent / 100);
            return (
              <TouchableOpacity
                key={med.drug_id}
                style={styles.medicineCardNew}
                onPress={() => setSelectedMedicine(med)}
                activeOpacity={0.7}
              >
                {/* Image with Discount Badge */}
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{
                      uri:
                        med.image ||
                        'https://cdn-icons-png.flaticon.com/512/2533/2533459.png',
                    }}
                    style={styles.medicineThumbNew}
                  />
                  {med.discount_percent > 0 && (
                    <View style={styles.discountBadgeSmall}>
                      <Text style={styles.discountBadgeSmallText}>
                        -{med.discount_percent}%
                      </Text>
                    </View>
                  )}
                </View>

                {/* Medicine Info */}
                <View style={styles.cardContent}>
                  <Text style={styles.medicineNameNew} numberOfLines={2}>
                    {med.name}
                  </Text>

                  {/* Price Section */}
                  <View style={styles.cardPriceContainer}>
                    <View>
                      <Text style={styles.medicinePriceNew}>
                        {discountedPrice.toLocaleString('vi-VN')}đ
                      </Text>
                      {med.discount_percent > 0 && (
                        <Text style={styles.originalPriceSmall}>
                          {med.price.toLocaleString('vi-VN')}đ
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Stock & Sold Info */}
                  <View style={styles.cardFooter}>
                    <View style={styles.stockIndicator}>
                      <Ionicons name="cube-outline" size={14} color="#666" />
                      <Text style={styles.stockText}>
                        Còn {med.stock_quantity}
                      </Text>
                    </View>
                    <View style={styles.soldIndicator}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={14}
                        color="#28a745"
                      />
                      <Text style={styles.soldText}>
                        Đã bán {med.sold_quantity}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Arrow Icon */}
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.primaryBlue}
                  style={styles.cardArrow}
                />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicineListScreen;

const styles = StyleSheet.create({
  // Base Container
  container: { flex: 1, backgroundColor: '#f5f7fa' },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#3366FF' },
  cartButton: { padding: 5, position: 'relative' },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // List Container
  listContainer: {
    padding: 15,
  },

  // New Medicine Card (List View)
  medicineCardNew: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  medicineThumbNew: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    objectFit: 'contain',
  },
  discountBadgeSmall: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountBadgeSmallText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  medicineNameNew: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  cardPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  medicinePriceNew: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1250DC',
  },
  originalPriceSmall: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  soldIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  soldText: {
    fontSize: 12,
    color: '#28a745',
  },
  cardArrow: {
    alignSelf: 'center',
    marginLeft: 8,
  },

  // Detail View Styles
  imageContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
  },
  medicineImage: {
    width: '85%',
    height: 280,
    resizeMode: 'contain',
  },
  discountBadgeLarge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  discountBadgeLargeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailContentContainer: {
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
  },
  detailMedicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 32,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 16,
  },
  outOfStockBadge: {
    backgroundColor: '#ffebee',
  },
  stockBadgeText: {
    fontSize: 13,
    color: '#28a745',
    fontWeight: '600',
  },
  outOfStockBadgeText: {
    color: '#dc3545',
  },
  priceSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailPriceLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  priceGroup: {
    alignItems: 'flex-end',
  },
  detailPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1250DC',
  },
  detailOriginalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  descriptionSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  detailDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },
  quantitySectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quantityCardLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  quantityControlsNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButtonNew: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3366FF',
  },
  quantityDisplayNew: {
    minWidth: 60,
    alignItems: 'center',
  },
  quantityValueNew: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  // Bottom Cart Container
  bottomCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalPriceLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  totalPriceValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1250DC',
  },
  addToCartButtonNew: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 15,
    color: '#999',
  },
});

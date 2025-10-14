import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { VnpayApi } from '../apis/vnpay/vnpayApi';

interface VNPayWebViewProps {
  paymentUrl: string;
  onPaymentSuccess: (orderId: string) => void;
  onPaymentError: (error: string) => void;
  onClose: () => void;
  colors: {
    primaryBlue: string;
    textDark: string;
  };
}

const VNPayWebView: React.FC<VNPayWebViewProps> = ({
  paymentUrl,
  onPaymentSuccess,
  onPaymentError,
  onClose,
  colors,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    // Check if it's a VNPay return URL và chưa verify
    if (url.includes('vnp_ResponseCode') && !isVerifying) {
      setIsVerifying(true);
      setIsLoading(true);

      try {
        // Extract query string from URL
        const queryString = url.split('?')[1];

        if (!queryString) {
          onPaymentError('URL thanh toán không hợp lệ');
          return;
        }

        // Verify payment with backend - giống logic Next.js
        const result = await VnpayApi.verifyReturn(`?${queryString}`);
        const { status, orderId } = result.data || {};

        if (status === 'success' && orderId) {
          // Payment successful and verified
          onPaymentSuccess(orderId);
        } else {
          // Payment verification failed
          onPaymentError('Thanh toán thất bại. Vui lòng thử lại.');
        }
      } catch (error: any) {
        console.error('Error verifying VNPay payment:', error);
        onPaymentError(
          error.message || 'Có lỗi xảy ra khi xác thực thanh toán.',
        );
      } finally {
        setIsVerifying(false);
        setIsLoading(false);
      }
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán VNPay</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>
            {isVerifying
              ? 'Đang xác thực giao dịch...'
              : 'Đang tải trang thanh toán...'}
          </Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        source={{ uri: paymentUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3366FF',
  },
  headerSpacer: {
    width: 24,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5C5C5C',
  },
  webview: {
    flex: 1,
  },
});

export default VNPayWebView;

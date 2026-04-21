// Debug script untuk test koneksi database
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rqrlozaouqyohsmzwbsh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcmxvemFvdXF5b2hzbXp3YnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTI0MzksImV4cCI6MjA5MjI2ODQzOX0.9rqv3rUTjWKruf-nXK-2jgwwQkrf4VmggF3YVbY7bhs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('🔍 Testing Supabase Connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')
  
  try {
    // Test 1: Basic connection
    console.log('\n📡 Test 1: Basic Connection')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('stocks')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      console.error('❌ Connection Error:', connectionError)
      return
    }
    console.log('✅ Connection successful')
    console.log('📊 Total records:', connectionTest)

    // Test 2: Fetch all stocks
    console.log('\n📦 Test 2: Fetch All Stocks')
    const { data: stocks, error: fetchError } = await supabase
      .from('stocks')
      .select('*')
      .order('id', { ascending: true })
    
    if (fetchError) {
      console.error('❌ Fetch Error:', fetchError)
      return
    }
    
    console.log('✅ Fetch successful')
    console.log('📊 Records found:', stocks?.length || 0)
    
    if (stocks && stocks.length > 0) {
      console.log('\n📋 Sample Data:')
      stocks.slice(0, 3).forEach((stock, index) => {
        console.log(`${index + 1}. ${stock.brand} - ${stock.nama_produk} (Stok: ${stock.stok})`)
      })
    } else {
      console.log('⚠️  No data found in stocks table')
    }

    // Test 3: Check RLS policies
    console.log('\n🔒 Test 3: Check RLS Status')
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('check_rls_status')
      .single()
    
    if (rlsError) {
      console.log('⚠️  Cannot check RLS status (function might not exist)')
      console.log('RLS Error:', rlsError.message)
    } else {
      console.log('🔒 RLS Status:', rlsData)
    }

    // Test 4: Try insert test (to check permissions)
    console.log('\n✏️  Test 4: Test Insert Permission')
    const testData = {
      brand: 'TEST_BRAND',
      nama_produk: 'TEST_PRODUCT',
      jenis_produk: 'TEST_TYPE',
      kemasan: '1 KG',
      warna: 'TEST_COLOR',
      kode_warna: 'T001',
      stok: 1,
      harga_beli: 10000,
      harga_jual: 15000
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('stocks')
      .insert([testData])
      .select()
    
    if (insertError) {
      console.error('❌ Insert Error:', insertError)
      console.log('This might indicate RLS or permission issues')
    } else {
      console.log('✅ Insert successful:', insertData)
      
      // Clean up test data
      if (insertData && insertData[0]) {
        await supabase
          .from('stocks')
          .delete()
          .eq('id', insertData[0].id)
        console.log('🧹 Test data cleaned up')
      }
    }

  } catch (error) {
    console.error('💥 Unexpected Error:', error)
  }
}

// Run the test
testDatabase()
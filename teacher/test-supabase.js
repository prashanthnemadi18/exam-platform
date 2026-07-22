// Test Supabase Connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

console.log('📋 Configuration:');
console.log('URL:', supabaseUrl || '❌ NOT SET');
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '❌ NOT SET');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase credentials not configured!');
  console.log('\nPlease check your .env.local file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('⏳ Testing connection to Supabase...\n');

    // Test 1: Check if tables exist
    console.log('Test 1: Checking students table...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('count');

    if (studentsError) {
      console.log('❌ Students table error:', studentsError.message);
      if (studentsError.code === '42P01') {
        console.log('   → Table does not exist. Please run the SQL from SUPABASE-QUICK-START.md');
      }
    } else {
      console.log('✅ Students table exists');
    }

    // Test 2: Check exams table
    console.log('\nTest 2: Checking exams table...');
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('count');

    if (examsError) {
      console.log('❌ Exams table error:', examsError.message);
      if (examsError.code === '42P01') {
        console.log('   → Table does not exist. Please run the SQL from SUPABASE-QUICK-START.md');
      }
    } else {
      console.log('✅ Exams table exists');
    }

    // Test 3: Check submissions table
    console.log('\nTest 3: Checking submissions table...');
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('count');

    if (submissionsError) {
      console.log('❌ Submissions table error:', submissionsError.message);
      if (submissionsError.code === '42P01') {
        console.log('   → Table does not exist. Please run the SQL from SUPABASE-QUICK-START.md');
      }
    } else {
      console.log('✅ Submissions table exists');
    }

    // Test 4: Count existing data
    if (!studentsError && !examsError && !submissionsError) {
      console.log('\n📊 Current Data:');
      
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      console.log(`   Students: ${studentCount || 0}`);

      const { count: examCount } = await supabase
        .from('exams')
        .select('*', { count: 'exact', head: true });
      console.log(`   Exams: ${examCount || 0}`);

      const { count: submissionCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true });
      console.log(`   Submissions: ${submissionCount || 0}`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    if (!studentsError && !examsError && !submissionsError) {
      console.log('✅ SUCCESS: Supabase is connected and working!');
      console.log('🚀 You can now run: npm run dev');
    } else {
      console.log('⚠️ PARTIAL SUCCESS: Connection works but tables need setup');
      console.log('📖 Please run the SQL from: SUPABASE-QUICK-START.md');
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR:', error.message);
    console.error('\nFull error:', error);
  }
}

testConnection();

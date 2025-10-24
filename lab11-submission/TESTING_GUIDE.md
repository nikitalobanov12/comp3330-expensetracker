# Lab 11 Testing & Screenshot Guide

## Setup

1. **Start the backend** (Terminal 1):
   ```bash
   bun run dev
   ```

2. **Start the frontend** (Terminal 2):
   ```bash
   cd frontend
   bun run dev
   ```

3. Open browser to `http://localhost:5173`
4. Open DevTools (F12)

## Screenshot 1: optimistic_add.png

**Goal**: Show expense appearing instantly before server responds

**Steps**:
1. Open DevTools → Network tab
2. Set throttling to **"Slow 3G"** (dropdown at top of Network tab)
3. Fill in expense form (e.g., "Coffee" / $5)
4. Click "Add Expense"
5. **Immediately take screenshot** while button shows spinner
6. You should see:
   - New expense in list (optimistic)
   - Button showing loading spinner
   - Network request still pending

## Screenshot 2: optimistic_delete.png

**Goal**: Show expense disappearing instantly before server responds

**Steps**:
1. Keep "Slow 3G" throttling enabled
2. Click delete (trash icon) on an expense
3. **Immediately take screenshot**
4. You should see:
   - Expense removed from list (optimistic)
   - Network request still pending in DevTools

## Screenshot 3: empty_state.png

**Goal**: Show enhanced empty state UI

**Steps**:
1. Delete all expenses
2. Wait for list to be empty
3. Take screenshot showing:
   - "No expenses yet" heading
   - Helpful description text
   - Clean, centered layout

## Screenshot 4: polish_bonus.png

**Options** (pick one):

### Option A: Skeleton Loading
1. Refresh page with Network throttling enabled
2. **Immediately take screenshot** during initial load
3. Should show 3 animated skeleton placeholder rows

### Option B: Inline Validation
1. In add form, type only "ab" in title field (less than 3 chars)
2. Enter "0" or "-5" in amount field
3. Take screenshot showing validation error messages below fields

## Testing Rollback (Optional - for your verification)

**To test that rollback works on error**:
1. Add an expense with throttling enabled
2. **Stop the backend server** before request completes
3. Should see expense appear, then disappear when request fails
4. Should see error message with "Try Again" button

---

## Quick Testing Checklist

- [ ] Optimistic add shows instant UI update
- [ ] Optimistic delete shows instant removal
- [ ] Loading spinner appears in button
- [ ] Skeleton rows show during initial load
- [ ] Empty state displays when no expenses
- [ ] Inline validation shows error messages
- [ ] Error panel with retry button works
- [ ] Rollback happens on server failure

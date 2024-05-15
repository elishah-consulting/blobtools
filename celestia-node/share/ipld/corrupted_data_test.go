package ipld_test

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/celestiaorg/celestia-node/header/headertest"
	"github.com/celestiaorg/celestia-node/share"
	"github.com/celestiaorg/celestia-node/share/availability/full"
	availability_test "github.com/celestiaorg/celestia-node/share/availability/test"
	"github.com/celestiaorg/celestia-node/share/getters"
)

// sharesAvailableTimeout is an arbitrarily picked interval of time in which a TestNode is expected
// to be able to complete a SharesAvailable request from a connected peer in a TestDagNet.
const sharesAvailableTimeout = 2 * time.Second

// TestNamespaceHasher_CorruptedData is an integration test that verifies that the NamespaceHasher
// of a recipient of corrupted data will not panic, and will throw away the corrupted data.
func TestNamespaceHasher_CorruptedData(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	t.Cleanup(cancel)
	net := availability_test.NewTestDAGNet(ctx, t)

	requester := full.Node(net)
	provider, mockBS := availability_test.MockNode(t, net)
	provider.Availability = full.TestAvailability(t, getters.NewIPLDGetter(provider.BlockService))
	net.ConnectAll()

	// before the provider starts attacking, we should be able to retrieve successfully. We pass a size
	// 16 block, but this is not important to the test and any valid block size behaves the same.
	root := availability_test.RandFillBS(t, 16, provider.BlockService)

	eh := headertest.RandExtendedHeaderWithRoot(t, root)
	getCtx, cancelGet := context.WithTimeout(ctx, sharesAvailableTimeout)
	t.Cleanup(cancelGet)
	err := requester.SharesAvailable(getCtx, eh)
	require.NoError(t, err)

	// clear the storage of the requester so that it must retrieve again, then start attacking
	// we reinitialize the node to clear the eds store
	requester = full.Node(net)
	mockBS.Attacking = true
	getCtx, cancelGet = context.WithTimeout(ctx, sharesAvailableTimeout)
	t.Cleanup(cancelGet)
	err = requester.SharesAvailable(getCtx, eh)
	require.ErrorIs(t, err, share.ErrNotAvailable)
}

import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Drawer,
  Heading,
  Input,
  Label,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui";
import { useMemo, useState } from "react";
import { useSellersTableQuery, validateEmail } from "./helpers";

import { ActionsButton } from "../../common/ActionsButton";
import { PencilSquare, Shopping, User } from "@medusajs/icons";
import { useSellersTableColumns } from "./helpers/use-seller-table-columns";
import { createColumnHelper } from "@tanstack/react-table"
import { useDataTable } from "../../hooks/table/use-data-table";
import { DataTable } from "../../components/table/data-table";
import { useInviteSeller, useCreateSeller, useSellers, useUpdateSeller } from "../../hooks/api/seller";
import { useNavigate } from "react-router-dom";
import { VendorSeller } from "./types";

const PAGE_SIZE = 10

type SellersProps = VendorSeller & { store_status: string }

type SellersResponse = {
  sellers?: SellersProps[],
  isLoading: boolean
}

const SellersListPage = () => {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sellerData, setSellerData] = useState({
    name: "",
    email: "",
    member_name: "",
    description: "",
    phone: ""
  });
  const { searchParams, raw } = useSellersTableQuery({
    pageSize: PAGE_SIZE,
    offset: 0,
  })


  const { sellers, isLoading } = useSellers({
    fields: "id,email,name,created_at,store_status"
  },
    undefined,
    {
      q: searchParams.q,
      order: searchParams.order
    }) as SellersResponse;

  const { mutateAsync: inviteSeller } = useInviteSeller();
  const { mutateAsync: createSeller } = useCreateSeller();

  const columns = useColumns()

  const { table } = useDataTable({
    data: sellers,
    columns,
    count: sellers?.length || 0,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row?.id || "",
  })


  const handleInvite = async () => {
    try {
      const isValid = validateEmail(email);
      if (!isValid) {
        return;
      }

      await inviteSeller({ email });
      toast.success("Invited!");
      setOpen(false);
      setEmail("");
    } catch {
      toast.error("Error!");
    }
  };

  const handleCreateSeller = async () => {
    try {
      if (!sellerData.name || !sellerData.email || !sellerData.member_name) {
        toast.error("Please fill in all required fields");
        return;
      }

      const isValid = validateEmail(sellerData.email);
      if (!isValid) {
        toast.error("Please enter a valid email address");
        return;
      }

      await createSeller(sellerData);
      toast.success("Seller created successfully! An email has been sent with password setup instructions.");
      setCreateOpen(false);
      setSellerData({
        name: "",
        email: "",
        member_name: "",
        description: "",
        phone: ""
      });
    } catch (error: any) {
      toast.error(error?.message || "Error creating seller!");
    }
  };


  return (
    <Container>
      <div className="flex items-center justify-between">
        <div>
          <Heading>Sellers</Heading>
        </div>
        <div className="flex gap-2">
          {/* Create Seller Drawer */}
          <Drawer
            open={createOpen}
            onOpenChange={(openChanged) => setCreateOpen(openChanged)}
          >
            <Drawer.Trigger
              onClick={() => {
                setCreateOpen(true);
              }}
              asChild
            >
              <Button variant="primary">Create Seller</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header />
              <Drawer.Body>
                <Heading>Create New Seller</Heading>
                <Text className="text-ui-fg-subtle" size="small">
                  Create a new seller account and send them a welcome email with password setup instructions
                </Text>
                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex flex-col gap-2">
                    <Label>Store Name *</Label>
                    <Input
                      placeholder="Store name"
                      value={sellerData.name}
                      onChange={(e) => setSellerData({ ...sellerData, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Email *</Label>
                    <Input
                      placeholder="seller@example.com"
                      type="email"
                      value={sellerData.email}
                      onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Member Name *</Label>
                    <Input
                      placeholder="John Doe"
                      value={sellerData.member_name}
                      onChange={(e) => setSellerData({ ...sellerData, member_name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Store description (optional)"
                      value={sellerData.description}
                      onChange={(e) => setSellerData({ ...sellerData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="Phone number (optional)"
                      value={sellerData.phone}
                      onChange={(e) => setSellerData({ ...sellerData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="mt-6" onClick={handleCreateSeller}>Create Seller</Button>
                </div>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>

          {/* Invite Seller Drawer */}
          <Drawer
            open={open}
            onOpenChange={(openChanged) => setOpen(openChanged)}
          >
            <Drawer.Trigger
              onClick={() => {
                setOpen(true);
              }}
              asChild
            >
              <Button>Invite</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header />
              <Drawer.Body>
                <Heading>Invite Seller</Heading>
                <Text className="text-ui-fg-subtle" size="small">
                  Invite a new seller to your store
                </Text>
                <div className="flex flex-col gap-2 mt-6">
                  <Label>Email</Label>
                  <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <Button className="mt-6" onClick={handleInvite}>Invite</Button>
                </div>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
      </div>
      <div className="flex size-full flex-col overflow-hidden">
        <DataTable
          table={table}
          columns={columns}
          count={sellers?.length || 0}
          pageSize={10}
          isLoading={isLoading}
          queryObject={raw}
          search
          pagination
          navigateTo={(row) => `/sellers/${row.id}`}
          orderBy={[
            { key: "email", label: "Email" },
            { key: "name", label: "Name" },
            { key: "created_at", label: "Created" },
          ]}
        />
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Sellers",
  icon: Shopping,
});

const columnHelper = createColumnHelper<VendorSeller>()


const useColumns = () => {

  const dialog = usePrompt()

  const navigate = useNavigate()

  const { mutateAsync: suspendSeller } = useUpdateSeller();

  const handleSuspend = async (seller: SellersProps) => {
    const res = await dialog({
      title: seller.store_status === "SUSPENDED" ? "Activate account" : "Suspend account",
      description: seller.store_status === "SUSPENDED" ? "Are you sure you want to activate this account?" : "Are you sure you want to suspend this account?",
      verificationText: seller.email || seller.name || "",
    })

    if (!res) {
      return
    }

    if (seller.store_status === "SUSPENDED") {
      await suspendSeller({ id: seller.id, data: { store_status: "ACTIVE" } });
    } else {
      await suspendSeller({ id: seller.id, data: { store_status: "SUSPENDED" } });
    }

  };

  const base = useSellersTableColumns()

  const columns = useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <ActionsButton
              actions={[
                {
                  label: "Edit",
                  onClick: () => navigate(`/sellers/${row.original.id}/edit`),
                  icon: <PencilSquare />
                },
                {
                  label: row.original.store_status === "SUSPENDED" ? "Activate account" : "Suspend account",
                  onClick: () => handleSuspend(row.original as SellersProps),
                  icon: <User />
                }
              ]}
            />
          )
        },
      }),
    ],
    [base]
  )

  return columns
}
export default SellersListPage;

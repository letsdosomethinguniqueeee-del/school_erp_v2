import React, { useState, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Flex,
  Text,
  Button,
  ButtonGroup,
  Select,
  HStack,
  VStack,
  useBreakpointValue,
  Badge,
  IconButton,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SearchIcon,
  CloseIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon
} from '@chakra-ui/icons';

const ResponsiveTable = ({
  data = [],
  columns = [],
  pageSize = 10,
  showPagination = true,
  showPageSizeSelector = true,
  showTotalCount = true,
  onRowClick = null,
  onEdit = null,
  onDelete = null,
  onView = null,
  sortable = true,
  searchable = true,
  onSearch = null,
  loading = false,
  emptyMessage = "No data available",
  maxHeight = "600px",
  stickyHeader = true,
  variant = "simple",
  size = "md",
  searchPlaceholder = "Search...",
  searchFields = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedPageSize, setSelectedPageSize] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState('');

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(row => {
      // If specific search fields are provided, search only those fields
      if (searchFields.length > 0) {
        return searchFields.some(field => {
          const value = row[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      }
      
      // Otherwise, search all column values
      return columns.some(column => {
        const value = row[column.key];
        return value && value.toString().toLowerCase().includes(searchLower);
      });
    });
  }, [data, searchTerm, searchFields, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = startIndex + selectedPageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, selectedPageSize]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / selectedPageSize);
  const startItem = (currentPage - 1) * selectedPageSize + 1;
  const endItem = Math.min(currentPage * selectedPageSize, sortedData.length);

  // Handle sort
  const handleSort = (field) => {
    if (!sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setSelectedPageSize(parseInt(newSize));
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (!sortable || sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />;
  };

  // Render action buttons
  const renderActionButtons = (row, index) => {
    const actions = [];
    
    if (onView) {
      actions.push(
        <IconButton
          key="view"
          size="sm"
          variant="solid"
          bg="green.500"
          color="white"
          icon={<ViewIcon />}
          onClick={() => onView(row, index)}
          _hover={{ bg: "green.600" }}
          borderRadius="8px"
          minW="32px"
          h="32px"
        />
      );
    }
    
    if (onEdit) {
      actions.push(
        <IconButton
          key="edit"
          size="sm"
          variant="solid"
          bg="gray.300"
          color="black"
          icon={<EditIcon />}
          onClick={() => onEdit(row, index)}
          _hover={{ bg: "gray.400" }}
          borderRadius="6px"
          minW="32px"
          h="32px"
        />
      );
    }
    
    if (onDelete) {
      actions.push(
        <IconButton
          key="delete"
          size="sm"
          variant="solid"
          bg="red.500"
          color="white"
          icon={<DeleteIcon />}
          onClick={() => onDelete(row, index)}
          _hover={{ bg: "red.600" }}
          borderRadius="8px"
          minW="32px"
          h="32px"
        />
      );
    }
    
    return actions;
  };

  // Render cell content
  const renderCellContent = (column, row, index) => {
    const value = row[column.key];
    
    const formatDateDDMMYYYY = (dateValue) => {
      if (!dateValue) return '';
      const d = new Date(dateValue);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    const formatTimeIST = (dateValue) => {
      if (!dateValue) return '';
      const d = new Date(dateValue);
      const time = d.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      return time.replace(/am|pm/g, (s) => s.toUpperCase());
    };

    if (column.render) {
      return column.render(value, row, index);
    }
    
    if (column.type === 'badge') {
      return (
        <Badge 
          colorScheme={column.badgeColor || 'blue'} 
          variant="subtle"
          px="8px"
          py="2px"
          borderRadius="12px"
        >
          {value}
        </Badge>
      );
    }
    
    if (column.type === 'date') {
      return formatDateDDMMYYYY(value);
    }
    
    if (column.type === 'datetime') {
      if (!value) return '';
      return `${formatDateDDMMYYYY(value)} ${formatTimeIST(value)}`;
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(value);
    }
    
    return value;
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <Box width="100%" bg={bgColor} borderRadius="lg" overflow="hidden" boxShadow="lg">
      {/* Search Filter */}
      {searchable && (
        <Box 
          p={4} 
          borderBottom="1px solid" 
          borderColor={borderColor}
          borderWidth="0.5px"
          borderTopLeftRadius="8px"
          borderTopRightRadius="8px"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={4}
            align={{ base: "stretch", md: "center" }}
          >
            <Box flex="1" minW="200px">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  bg="white"
                  borderColor="gray.300"
                  sx={{
                    paddingLeft: "40px !important",
                    paddingRight: searchTerm ? "40px !important" : "12px !important"
                  }}
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                />
                {searchTerm && (
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={<CloseIcon />}
                      onClick={clearSearch}
                      aria-label="Clear search"
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </Box>
          </Flex>
        </Box>
      )}

      {/* Table Container */}
      <TableContainer 
        maxHeight={maxHeight} 
        overflowX="auto"
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <Table variant={variant} size={size} minWidth="100%">
          <Thead position={stickyHeader ? "sticky" : "static"} top="0" zIndex="1" bg={headerBg}>
            <Tr>
              {columns.map((column, index) => (
                <Th
                  key={index}
                  onClick={() => handleSort(column.key)}
                  cursor={sortable ? "pointer" : "default"}
                  _hover={sortable ? { bg: hoverBg } : {}}
                  whiteSpace="nowrap"
                  minW={column.minWidth || "120px"}
                  maxW={column.maxWidth || "none"}
                  display="table-cell"
                >
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="600">
                      {column.label}
                    </Text>
                    {renderSortIcon(column.key)}
                  </HStack>
                </Th>
              ))}
              {(onView || onEdit || onDelete) && (
                <Th textAlign="center" whiteSpace="nowrap">
                  Actions
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0)} textAlign="center" py={8}>
                  <Text>Loading...</Text>
                </Td>
              </Tr>
            ) : paginatedData.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0)} textAlign="center" py={8}>
                  <Text color="gray.500">{emptyMessage}</Text>
                </Td>
              </Tr>
            ) : (
              paginatedData.map((row, index) => (
                <Tr
                  key={index}
                  _hover={{ bg: hoverBg }}
                  cursor={onRowClick ? "pointer" : "default"}
                  onClick={() => onRowClick && onRowClick(row, index)}
                >
                  {columns.map((column, colIndex) => (
                    <Td
                      key={colIndex}
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      minW={column.minWidth || "120px"}
                      maxW={column.maxWidth || "none"}
                      display="table-cell"
                    >
                      {renderCellContent(column, row, index)}
                    </Td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <Td textAlign="center">
                      <HStack spacing={1} justify="center">
                        {renderActionButtons(row, index)}
                      </HStack>
                    </Td>
                  )}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Box p={4} borderTop="1px solid" borderColor={borderColor}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            {/* Page Info - Left side on large screens, top on small screens */}
            <HStack spacing={3} align="center" flexWrap="wrap" justify={{ base: "center", lg: "start" }}>
              {showPageSizeSelector && (
                <HStack spacing={2}>
                  <Text fontSize="sm">Show:</Text>
                  <Select
                    size="sm"
                    value={selectedPageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    width="70px"
                    sx={{
                      paddingLeft: "8px !important",
                      paddingRight: "8px !important",
                      paddingTop: "4px !important",
                      paddingBottom: "4px !important"
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Select>
                </HStack>
              )}
              {showTotalCount && (
                <Text fontSize="sm" color="gray.600">
                  Showing {startItem} to {endItem} of {sortedData.length} entries
                </Text>
              )}
            </HStack>

            {/* Pagination Controls - Right side on large screens, centered on small screens */}
            <Flex justify={{ base: "center", lg: "end" }}>
              <ButtonGroup 
                size="sm" 
                isAttached 
                variant="outline"
                sx={{
                  '& button': {
                    padding: '6px 12px !important'
                  },
                  '@media (max-width: 420px)': {
                    '& button': {
                      fontSize: '10px',
                      padding: '6px 6px !important',
                      minWidth: '20px',
                      height: '24px'
                    }
                  }
                }}
              >
              <Button
                onClick={() => handlePageChange(1)}
                isDisabled={currentPage === 1}
                leftIcon={<ChevronLeftIcon />}
              >
                First
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
                leftIcon={<ChevronLeftIcon />}
              >
                Previous
              </Button>
              
              {generatePageNumbers().map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  colorScheme={currentPage === page ? "blue" : "gray"}
                  variant={currentPage === page ? "solid" : "outline"}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages}
                rightIcon={<ChevronRightIcon />}
              >
                Next
              </Button>
              <Button
                onClick={() => handlePageChange(totalPages)}
                isDisabled={currentPage === totalPages}
                rightIcon={<ChevronRightIcon />}
              >
                Last
              </Button>
              </ButtonGroup>
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default ResponsiveTable;
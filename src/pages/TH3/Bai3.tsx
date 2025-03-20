import React, { useState, useEffect, CSSProperties } from 'react';

// Định nghĩa các kiểu dữ liệu
interface Employee {
  id: number;
  name: string;
  averageRating: number;
}

interface Rating {
  id: number;
  employeeId: number;
  customerId: number;
  appointmentId: number;
  rating: number;
  comment: string;
  date: Date;
  reply?: string;
}

interface Appointment {
  id: number;
  employeeId: number;
  customerId: number;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

// Component chính
const Bai3: React.FC = () => {
  // State quản lý
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Nguyễn Văn A', averageRating: 4.5 },
    { id: 2, name: 'Trần Thị B', averageRating: 4.2 },
    { id: 3, name: 'Lê Văn C', averageRating: 4.8 },
  ]);
  
  const [ratings, setRatings] = useState<Rating[]>([
    {
      id: 1,
      employeeId: 1,
      customerId: 1,
      appointmentId: 1,
      rating: 5,
      comment: 'Dịch vụ rất tốt, nhân viên nhiệt tình',
      date: new Date('2025-03-10'),
      reply: 'Cảm ơn quý khách đã đánh giá cao dịch vụ của chúng tôi!'
    },
    {
      id: 2,
      employeeId: 2,
      customerId: 2,
      appointmentId: 2,
      rating: 4,
      comment: 'Dịch vụ khá tốt nhưng còn chậm',
      date: new Date('2025-03-11')
    },
  ]);
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, employeeId: 1, customerId: 1, date: new Date('2025-03-10'), status: 'completed' },
    { id: 2, employeeId: 2, customerId: 2, date: new Date('2025-03-11'), status: 'completed' },
    { id: 3, employeeId: 3, customerId: 3, date: new Date('2025-03-12'), status: 'completed' },
    { id: 4, employeeId: 1, customerId: 3, date: new Date('2025-03-13'), status: 'completed' },
  ]);
  
  const [currentUser, setCurrentUser] = useState<{ id: number, role: 'customer' | 'employee' }>({ id: 3, role: 'customer' });
  
  // State cho form thêm/sửa nhân viên
  const [newEmployee, setNewEmployee] = useState<{ id?: number, name: string }>({ name: '' });
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // State cho form đánh giá
  const [newRating, setNewRating] = useState<{ 
    appointmentId: number,
    rating: number,
    comment: string 
  }>({ 
    appointmentId: 0,
    rating: 5,
    comment: '' 
  });
  
  // State cho form phản hồi
  const [replyText, setReplyText] = useState<string>('');
  const [selectedRatingId, setSelectedRatingId] = useState<number | null>(null);

  // Cập nhật đánh giá trung bình cho nhân viên
  useEffect(() => {
    const updatedEmployees = employees.map(employee => {
      const employeeRatings = ratings.filter(r => r.employeeId === employee.id);
      const sum = employeeRatings.reduce((acc, curr) => acc + curr.rating, 0);
      const average = employeeRatings.length > 0 ? sum / employeeRatings.length : 0;
      
      return {
        ...employee,
        averageRating: Number(average.toFixed(1))
      };
    });
    
    setEmployees(updatedEmployees);
  }, [ratings]);

  // Thêm nhân viên mới
  const handleAddEmployee = () => {
    if (newEmployee.name.trim() === '') return;
    
    if (editMode && newEmployee.id) {
      // Cập nhật nhân viên hiện có
      setEmployees(employees.map(emp => 
        emp.id === newEmployee.id ? { ...emp, name: newEmployee.name } : emp
      ));
      setEditMode(false);
    } else {
      // Thêm nhân viên mới
      const newId = Math.max(...employees.map(e => e.id), 0) + 1;
      setEmployees([...employees, { id: newId, name: newEmployee.name, averageRating: 0 }]);
    }
    
    setNewEmployee({ name: '' });
  };

  // Bắt đầu chỉnh sửa nhân viên
  const handleEditEmployee = (employee: Employee) => {
    setNewEmployee({ id: employee.id, name: employee.name });
    setEditMode(true);
  };

  // Xóa nhân viên
  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    setRatings(ratings.filter(rating => rating.employeeId !== id));
  };

  // Gửi đánh giá mới
  const handleSubmitRating = () => {
    if (newRating.appointmentId === 0 || newRating.comment.trim() === '') return;
    
    const appointment = appointments.find(a => a.id === newRating.appointmentId);
    if (!appointment) return;
    
    const newRatingObj: Rating = {
      id: Math.max(...ratings.map(r => r.id), 0) + 1,
      employeeId: appointment.employeeId,
      customerId: currentUser.id,
      appointmentId: newRating.appointmentId,
      rating: newRating.rating,
      comment: newRating.comment,
      date: new Date()
    };
    
    setRatings([...ratings, newRatingObj]);
    setNewRating({ appointmentId: 0, rating: 5, comment: '' });
  };

  // Phản hồi đánh giá
  const handleReplyToRating = () => {
    if (!selectedRatingId || replyText.trim() === '') return;
    
    setRatings(ratings.map(rating => 
      rating.id === selectedRatingId ? { ...rating, reply: replyText } : rating
    ));
    
    setReplyText('');
    setSelectedRatingId(null);
  };

  // Lấy danh sách lịch hẹn đã hoàn thành cho khách hàng hiện tại
  const completedAppointments = appointments.filter(
    a => a.customerId === currentUser.id && a.status === 'completed'
  );

  // CSS styles
  const styles: {[key: string]: CSSProperties} = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      color: '#d10000',
      borderBottom: '2px solid #d10000',
      paddingBottom: '10px',
      marginBottom: '20px',
    },
    section: {
      marginBottom: '30px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '15px',
    },
    sectionTitle: {
      color: '#d10000',
      marginBottom: '15px',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    form: {
      marginBottom: '15px',
    },
    input: {
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '70%',
      marginRight: '10px',
    },
    button: {
      padding: '8px 15px',
      backgroundColor: '#d10000',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonSecondary: {
      padding: '5px 10px',
      backgroundColor: '#d10000',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '12px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f8d7da',
      borderBottom: '2px solid #d10000',
      padding: '8px',
      textAlign: 'left',
    },
    td: {
      padding: '8px',
      borderBottom: '1px solid #ddd',
    },
    star: {
      color: '#d10000',
      fontSize: '18px',
      cursor: 'pointer',
    },
    select: {
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '100%',
      marginBottom: '15px',
    },
    textarea: {
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '100%',
      marginBottom: '15px',
      minHeight: '80px',
    },
    ratingItem: {
      borderBottom: '1px solid #eee',
      padding: '15px 0',
    },
    ratingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
    },
    replyBox: {
      backgroundColor: '#f8f8f8',
      padding: '10px',
      borderRadius: '4px',
      marginTop: '10px',
    },
    roleButton: {
      padding: '8px 15px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '20px',
    },
    flexRow: {
      display: 'flex',
      alignItems: 'center',
    },
    marginRight: {
      marginRight: '10px',
    },
    textRight: {
      textAlign: 'right',
    },
    marginTop: {
      marginTop: '10px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
    },
  };

  // Render component
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Hệ thống đánh giá dịch vụ và nhân viên</h1>
      
      {/* Phần quản lý nhân viên */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quản lý nhân viên</h2>
        
        <div style={styles.form}>
          <input
            type="text"
            style={styles.input}
            placeholder="Tên nhân viên"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <button 
            style={styles.button}
            onClick={handleAddEmployee}
          >
            {editMode ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Tên nhân viên</th>
              <th style={styles.th}>Đánh giá trung bình</th>
              <th style={styles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td style={styles.td}>{employee.id}</td>
                <td style={styles.td}>{employee.name}</td>
                <td style={styles.td}>
                  {employee.averageRating > 0 ? (
                    <div style={styles.flexRow}>
                      <span style={styles.marginRight}>{employee.averageRating}</span>
                      <div>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span key={index} style={styles.star}>
                            {index < Math.floor(employee.averageRating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : 'Chưa có đánh giá'}
                </td>
                <td style={styles.td}>
                  <button 
                    style={styles.buttonSecondary}
                    onClick={() => handleEditEmployee(employee)}
                  >
                    Sửa
                  </button>
                  <button 
                    style={{...styles.buttonSecondary, backgroundColor: '#dc3545'}}
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Phần đánh giá cho khách hàng */}
      {currentUser.role === 'customer' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Đánh giá dịch vụ</h2>
          
          <div>
            <label style={styles.label}>Chọn lịch hẹn đã hoàn thành:</label>
            <select 
              style={styles.select}
              value={newRating.appointmentId}
              onChange={(e) => setNewRating({ ...newRating, appointmentId: Number(e.target.value) })}
            >
              <option value={0}>-- Chọn lịch hẹn --</option>
              {completedAppointments.map(appointment => {
                const employee = employees.find(e => e.id === appointment.employeeId);
                const hasRated = ratings.some(r => r.appointmentId === appointment.id && r.customerId === currentUser.id);
                
                if (hasRated) return null;
                
                return (
                  <option key={appointment.id} value={appointment.id}>
                    {new Date(appointment.date).toLocaleDateString()} - {employee?.name || 'Nhân viên không xác định'}
                  </option>
                );
              })}
            </select>
          </div>
          
          {newRating.appointmentId > 0 && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={styles.label}>Đánh giá:</label>
                <div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span 
                      key={index}
                      style={styles.star}
                      onClick={() => setNewRating({ ...newRating, rating: index + 1 })}
                    >
                      {index < newRating.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={styles.label}>Nhận xét:</label>
                <textarea
                  style={styles.textarea}
                  value={newRating.comment}
                  onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
                ></textarea>
              </div>
              
              <button 
                style={styles.button}
                onClick={handleSubmitRating}
              >
                Gửi đánh giá
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Hiển thị đánh giá và phản hồi */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Các đánh giá</h2>
        
        {ratings.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          <div>
            {ratings.map(rating => {
              const employee = employees.find(e => e.id === rating.employeeId);
              
              return (
                <div key={rating.id} style={styles.ratingItem}>
                  <div style={styles.ratingHeader}>
                    <div>
                      <strong>Nhân viên:</strong> {employee?.name || 'Không xác định'}
                    </div>
                    <div>
                      <strong>Ngày:</strong> {new Date(rating.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Đánh giá:</strong>{' '}
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} style={styles.star}>
                        {index < rating.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Nhận xét:</strong> {rating.comment}
                  </div>
                  
                  {rating.reply && (
                    <div style={styles.replyBox}>
                      <strong>Phản hồi từ nhân viên:</strong> {rating.reply}
                    </div>
                  )}
                  
                  {currentUser.role === 'employee' && 
                   employee?.id === currentUser.id && 
                   !rating.reply && (
                    <div style={styles.marginTop}>
                      {selectedRatingId === rating.id ? (
                        <div>
                          <textarea
                            style={styles.textarea}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Nhập phản hồi của bạn..."
                          ></textarea>
                          <div style={styles.textRight}>
                            <button 
                              style={{...styles.buttonSecondary, backgroundColor: '#6c757d', marginRight: '10px'}}
                              onClick={() => {
                                setSelectedRatingId(null);
                                setReplyText('');
                              }}
                            >
                              Hủy
                            </button>
                            <button 
                              style={styles.buttonSecondary}
                              onClick={handleReplyToRating}
                            >
                              Gửi phản hồi
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          style={{...styles.buttonSecondary, backgroundColor: '#28a745'}}
                          onClick={() => setSelectedRatingId(rating.id)}
                        >
                          Phản hồi
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Chức năng chuyển đổi vai trò (để demo) */}
      <button 
        style={styles.roleButton}
        onClick={() => setCurrentUser({
          ...currentUser,
          role: currentUser.role === 'customer' ? 'employee' : 'customer',
          id: currentUser.role === 'customer' ? 1 : 3
        })}
      >
        Chuyển sang vai trò: {currentUser.role === 'customer' ? 'Nhân viên' : 'Khách hàng'}
      </button>
    </div>
  );
};

export default Bai3;